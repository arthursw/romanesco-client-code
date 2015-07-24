define [ 'UI/Modal', 'coffee', 'jqtree' ], (Modal, CoffeeScript) ->

	class FileManager

		constructor: ()->
			@codeJ = $('#Code')

			@runForkBtnJ = @codeJ.find('button.run-fork')
			@loadOwnForkBtnJ = @codeJ.find('li.user-fork')
			listForksBtnJ = @codeJ.find('li.list-forks')
			loadCustomForkBtnJ = @codeJ.find('li.custom-fork')
			@createForkBtnJ = @codeJ.find('li.create-fork')

			@loadOwnForkBtnJ.hide()
			@createForkBtnJ.hide()

			@getForks(@getUserFork)

			@runForkBtnJ.click @runFork
			@loadOwnForkBtnJ.click @loadOwnFork
			loadCustomForkBtnJ.click @loadCustomFork
			listForksBtnJ.click @listForks
			@createForkBtnJ.click @createFork

			createFileBtnJ = @codeJ.find('li.create-file')
			createDirectoryBtnJ = @codeJ.find('li.create-directory')
			runBtnJ = @codeJ.find('button.run')
			undoChangesBtnJ = @codeJ.find('button.undo-changes')
			commitBtnJ = @codeJ.find('button.commit')
			createPullRequestBtnJ = @codeJ.find('button.pull-request')

			createFileBtnJ.click @onCreateFile
			createDirectoryBtnJ.click @onCreateDirectory
			runBtnJ.click @runFork
			undoChangesBtnJ.click @onUndoChanges
			commitBtnJ.click @onCommitClicked
			createPullRequestBtnJ.click @createPullRequest

			@fileBrowserJ = @codeJ.find('.files')
			@files = []
			@nDirsToLoad = 1

			if R.repositoryOwner?
				@loadFork(owner: R.repositoryOwner)
			else
				@loadMainRepo()
			# $.get('https://api.github.com/repos/arthursw/romanesco-client-code/contents/', @loadFiles)
			# @state = '' + Math.random()
			# parameters =
			# 	client_id: '4140c547598d6588fd37'
			# 	redirect_uri: 'http://localhost:8000/github'
			# 	scope: 'public_repo'
			# 	state: @state
			# $.get( { url: 'https://github.com/login/oauth/authorize', data: parameters }, (result)-> console.log result; return)
			return

		# General request method

		request: (request, callback, method, data, params, headers)->
			Dajaxice.draw.githubRequest(callback, {githubRequest: request, method: method, data: data, params: params, headers: headers})
			return
		# Get, list & run forks

		getUserFork: (forks)=>
			forks = @checkError(forks)
			if not forks then return
			hasFork = false
			for fork in forks
				if fork.owner.login == R.me
					@loadOwnForkBtnJ.show()
					@createForkBtnJ.hide()
					hasFork = true
					break
			if not hasFork
				@loadOwnForkBtnJ.hide()
				@createForkBtnJ.show()
			return

		getForks: (callback)->
			@request('https://api.github.com/repos/arthursw/romanesco-client-code/forks', callback)
			return

		forkRowClicked: (event, field, value, row, $element)=>
			@loadFork(row)
			Modal.getModalByTitle('Forks').hide()
			return

		displayForks: (forks)=>
			forks = @checkError(forks)
			if not forks then return
			modal = Modal.createModal( title: 'Forks', submit: null )

			tableData =
				columns: [
					field: 'owner'
					title: 'Owner'
				,
					field: 'date'
					title: 'Date'
				,
					field: 'githubURL'
					title: 'Github URL'
				]
				data: []
				formatter: (value, row, index)->
					return "<a href='#{value}'>value</a>"

			for fork in forks
				date = new Date(fork.updated_at)
				tableData.data.push( owner: fork.owner.login, date: date.toLocaleString(), githubURL: fork.html_url )

			tableJ = modal.addTable(tableData)
			tableJ.on 'click-cell.bs.table', @forkRowClicked
			modal.show()
			return

		listForks: (event)=>
			event?.preventDefault()
			@getForks(@displayForks)
			return

		loadMainRepo: (event)=>
			event?.preventDefault()
			@loadFork(owner: 'arthursw')
			return

		loadOwnFork: (event)=>
			event?.preventDefault()
			@loadFork(owner: R.githubLogin)
			return

		loadFork: (data)=>
			@owner = data.owner
			@getMasterBranch()
			return

		loadCustomFork: (event)=>
			event?.preventDefault()
			modal = Modal.createModal( title: 'Load repository', submit: @loadFork )
			modal.addTextInput(name: 'owner', placeholder: 'The login name of the fork owner (ex: george)', label: 'Owner', required: true, submitShortcut: true)
			modal.show()
			return

		forkCreationResponse: (response)=>
			if response.status == 202
				message = 'Congratulation, you just made a new fork!'
				message += 'It should be available in a few seconds at this adress:' + response.url
				message += 'You will then be able to improve or customize it.'
				R.alertManager.alert message, 'success'
			return

		createFork: (event)=>
			event?.preventDefault()
			@request('https://api.github.com/repos/' + R.githubLogin + '/romanesco-client-code/forks', @forkCreationResponse, 'post')
			return

		# Navigate in files

		coffeeToJsPath: (coffeePath)->
			return coffeePath.replace(/^coffee/, 'js').replace(/coffee$/, 'js')

		getJsFile: (node)->
			return @getFileFromPath(@coffeeToJsPath(node.file.path))

		getFileFromPath: (path)->
			for file in @gitTree.tree
				if file.path == path
					return file
			return

		getNodeFromPath: (path)->
			dirs = path.split('/')
			dirs.shift() 			# remove 'coffee' since tree is based from coffee
			node = @tree
			for dirName, i in dirs
				node = node.leaves[dirName]
			return node

		getParentNode: (file, node)->
			dirs = file.path.split('/')
			file.name = dirs.pop()

			for dirName, i in dirs
				node.leaves[dirName] ?= { leaves: {}, children: [] }
				node = node.leaves[dirName]
			return node

		# Create tree

		buildTree: (files)->
			tree = { leaves: {}, children: [] }

			for file, i in files
				parentNode = @getParentNode(file, tree)
				name = file.name
				parentNode.leaves[name] ?= { leaves: {}, children: [] }
				node = parentNode.leaves[name]
				node.label = name
				node.id = i
				node.file = file
				parentNode.children.push(node)

			tree.id = i
			return tree

		updateLeaves: (tree)->
			tree.leaves = {}
			for node, i in tree.children
				tree.leaves[node.name] = node
				@updateLeaves(node)
			return

		# Open file

		loadFile: (path, callback)->
			@request('https://api.github.com/repos/arthursw/romanesco-client-code/contents/coffee/'+path, callback)
			return

		openFile: (file)=>
			file = @checkError(file)
			if not file then return
			node = @getNodeFromPath(file.file.path)
			node.source = atob(file.content)
			R.showCodeEditor(node)
			return

		# Create file

		createName: (name, parentNode)->
			i = 1
			while parentNode.leaves[name]?
				name = 'NewScript' + i + '.coffee'
			return name

		createGitFile: (path, type)->
			file =
				mode: if type == 'blob' then '100644' else '040000'
				path: path
				type: type
				content: ''
			@gitTree.tree.push(file)
			if type == 'blob'
				jsFile = Utils.clone(file)
				jsFile.path = @coffeeToJsPath(file.path)
				@gitTree.tree.push(jsFile)
			return file

		onCreate: (type='blob')->
			parentNode = @fileBrowserJ.tree('getSelectedNode')
			if not parentNode then parentNode = @fileBrowserJ.tree('getTree')
			if parentNode.file.type != 'tree' then parentNode = parentNode.parent
			defaultName = if type == 'blob' then 'NewScript.coffee' else 'NewDirectory'
			name = @createName(defaultName, parentNode)
			newNode =
				label: name
				children: []
				leaves: {}
				source: ''
				file: @createGitFile(parentNode.file.path + '/' + name, type)
				id: @tree.id++
			newNode = @fileBrowserJ.tree('appendNode', newNode, parentNode)
			@fileBrowserJ.tree('selectNode', newNode)
			parentNode.leaves[newNode.name] = newNode
			@onNodeDoubleClicked(node: newNode)
			R.showCodeEditor(newNode)
			return

		onCreateFile: ()=>
			@onCreate('blob')
			return

		onCreateDirec: ()=>
			@onCreate('tree')
			return

		# Move & rename file

		updatePath: (node, parent)->
			newPath = parent.file.path + '/' + node.name
			if node.file.type == 'blob'
				jsFile = @getJsFile(node)
				jsFile.path = @coffeeToJsPath(newPath)
			node.file.path = newPath
			if node.file.type == 'tree'
				for child in node.children
					@updatePath(child, node)
			return

		moveFile: (node, previousParent, target, position)->
			parent = if position == 'inside' then target else target.parent
			parent.leaves[node.name] = node
			parent.children.push(node)
			delete previousParent.leaves[node.name]
			Utils.Array.remove(previousParent.children, node)
			@updatePath(node, parent)
			return

		onFileMove: (event)=>
			target = event.move_info.target_node
			node = event.move_info.moved_node
			position = event.move_info.position
			previousParent = event.move_info.previous_parent
			if target == previousParent and position == 'inside' then return
			@moveFile(node, previousParent, target, position)
			@saveToLocalStorage()
			return

		# Rename file

		submitNewName: (event)=>
			if event.type == 'keyup' and event.which != 13 then return
			inputGroupJ = $(event.target).parents('.input-group')
			newName = inputGroupJ.find('.name-input').val()
			id = inputGroupJ.attr('data-node-id')
			node = @fileBrowserJ.tree('getNodeById', id)
			if newName == '' then newName = node.name
			inputGroupJ.replaceWith('<span class="jqtree-title jqtree_common">' + newName + '</span>')
			$(node.element).find('button.delete:first').show()
			delete node.parent.leaves[node.name]
			node.parent.leaves[newName] = node
			node.name = newName
			@updatePath(node, node.parent)
			@fileBrowserJ.tree('updateNode', node, newName)
			return

		onNodeDoubleClicked: (event)=>
			node = event.node
			inputGroupJ = $("""
			<div class="input-group">
				<input type="text" class="form-control name-input" placeholder="">
				<span class="input-group-btn">
					<button class="btn btn-default" type="button">Ok</button>
				</span>
			</div>
			""")
			inputGroupJ.attr('data-node-id', node.id)
			inputJ = inputGroupJ.find('.name-input')
			inputJ.attr('placeholder', node.name)
			inputJ.keyup @submitNewName
			inputJ.blur @submitNewName
			buttonJ = inputGroupJ.find('.btn')
			buttonJ.click @submitNewName
			$(node.element).find('.jqtree-title:first').replaceWith(inputGroupJ)
			inputJ.focus()
			$(node.element).find('button.delete:first').hide()
			return

		# Update file

		updateFile: (node, source, compiledSource)->
			node.source = source
			node.file.content = btoa(source)
			jsFile = @getJsFile(node)
			if compiledSource?
				jsFile.content = btoa(compiledSource)
				delete jsFile.sha
				delete jsFile.coffee
			else
				jsFile.coffee = node
			delete node.file.sha
			$(node.element).addClass('modified')
			@saveToLocalStorage()
			return

		# Delete file

		deleteFile: (node)->
			if node.file.type == 'tree'
				for child in node.children
					@deleteFile(child)
			Utils.Array.remove(@gitTree.tree, node.file)
			if node.file.type == 'blob'
				jsFile = @getJsFile(node)
				Utils.Array.remove(@gitTree.tree, jsFile)
			@fileBrowserJ.tree('removeNode', node)
			return

		confirmDeleteFile: (data)=>
			@deleteFile(data.data)
			return

		onDeleteFile: (event)=>
			event.stopPropagation()
			path = $(event.target).closest('button.delete').attr('data-path')
			node = @getNodeFromPath(path)
			if not node? then return
			modal = Modal.createModal( title: 'Delete file?', submit: @confirmDeleteFile, data: node )
			modal.addText('Do you really want to delete "' + node.name + '"?')
			modal.show()
			return

		# Save & load

		saveToLocalStorage: ()->
			Utils.LocalStorage.set('files:' + @owner, @gitTree)
			return

		# Create, Update & Delete files

		checkError: (response)->
			if response.status < 200 or response.status >= 300
				R.alertManager.alert('Error: ' + response.content.message, 'error')
				return false
			return response.content
		#
		# fileToData: (file, commitMessage, content=false, sha=false)->
		# 	data =
		# 		path: file.newPath or file.path
		# 		message: commitMessage
		# 	if content then data.content = btoa(file.source)
		# 	if sha then data.sha = file.sha
		# 	return data
		#
		# requestFile: (file, data, method='put')->
		# 	callback = (response)->
		# 		if not R.fileManager.checkError(response) then return
		# 		if file.newPath?
		# 			file.path = file.newPath
		# 			delete file.newPath
		# 		R.alertManager.alert('Successfully committed ' + file.name + '.', 'success')
		# 		return
		# 	@request('https://api.github.com/repos/' + @owner + '/romanesco-client-code/contents/'+file.path, callback, method, data)
		# 	return
		#
		# createFile: (file, commitMessage)->
		# 	data = @fileToData(file, commitMessage, true)
		# 	@requestFile(file, data)
		# 	return
		#
		# updateFile: (file, commitMessage)->
		# 	data = @fileToData(file, commitMessage, true, true)
		# 	$(file.element).removeClass('modified')
		# 	@requestFile(file, data)
		# 	return
		#
		# deleteFile: (file, commitMessage)->
		# 	data = @fileToData(file, commitMessage, false, true)
		# 	@requestFile(file, data, 'delete')
		# 	delete file.delete
		# 	return

		# Run, Commit & Push request

		runLastCommit: (branch)=>
			branch = @checkError(branch)
			if not branch then return
			R.repository.owner = @owner
			R.repository.commit = branch.commit.sha
			R.view.updateHash()
			location.reload()
			return

		runFork: (data)=>
			if data?.owner? then @owner = data.owner
			@request('https://api.github.com/repos/' + @owner + '/romanesco-client-code/branches/master', @runLastCommit)
			return

		onCommitClicked: (event)=>
			modal = Modal.createModal( title: 'Commit', submit: @commitChanges )
			modal.addTextInput(name: 'commitMessage', placeholder: 'Added the coffee maker feature.', label: 'Message', required: true, submitShortcut: true)
			modal.show()
			return

		# Undo changes

		undoChanges: ()=>
			Utils.LocalStorage.set('files:' + @owner, null)
			@getMasterBranch()
			return

		onUndoChanges: ()=>
			modal = new Modal(title: 'Undo changes?', submit: @undoChanges)
			modal.addText('Do you really want to revert your repository to the previous commit? All changes will be lost.')
			modal.show()
			return

		#
		# commit: (data)=>
		# 	nodes = @getNodes()
		# 	nothingToCommit = true
		# 	@filesToCommit = 0
		# 	for file in nodes
		# 		if file.delete or file.create or file.update or file.newPath? then @filesToCommit++
		# 		if file.delete
		# 			@deleteFile(file, data.commitMessage)
		# 		else if file.create
		# 			@createFile(file, data.commitMessage)
		# 		else if file.update or file.newPath?
		# 			@updateFile(file, data.commitMessage)
		# 	if @filesToCommit==0
		# 		R.alertManager.alert 'Nothing to commit.', 'Info'
		# 	return

		createPullRequest: ()=>
			modal = Modal.createModal( title: 'Create pull request', submit: @createPullRequestSubmit )
			modal.addTextInput(name: 'title', placeholder: 'Amazing new feature', label: 'Title of the pull request', required: true)
			modal.addTextInput(name: 'branch', placeholder: 'master', label: 'Branch', required: true, submitShortcut: true)
			modal.addTextInput(name: 'body', placeholder: 'Please pull this in!', label: 'Message', required: false)
			modal.show()
			return

		createPullRequestSubmit: (data)=>
			data =
				title: data.title
				head: @owner + ':' + data.branch
				base: 'master'
				body: data.body
			@request('https://api.github.com/repos/arthursw/romanesco-client-code/pulls', @checkError, 'post', data)
			return

		# Low level git operation

		# getLastCommit: (head)->
		# 	head = @checkError(head)
		# 	if not head then return
		# 	@commit.head = sha: head.sha, url: head.url
		# 	@request('https://api.github.com/repos/' + @owner + '/romanesco-client-code/git/commits/'+head.object.sha, @runLastCommit)
		# 	return
		#
		# getHead: ()->
		# 	@commit = {}
		# 	@request('https://api.github.com/repos/' + @owner + '/romanesco-client-code/git/refs/heads/master', @getLastCommit)
		# 	return

		# jqTree events

		onCanMoveTo: (moved_node, target_node, position)->
			targetIsFolder = target_node.file.type == 'tree'
			nameExistsInTargetNode = target_node.leaves[moved_node.name]?
			return (targetIsFolder and not nameExistsInTargetNode) or position != 'inside'

		onCreateLi: (node, liJ)=>
			deleteButtonJ = $("""
			<button type="button" class="close delete" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
			""")
			deleteButtonJ.attr('data-path', node.file.path)
			deleteButtonJ.click(@onDeleteFile)
			liJ.find('.jqtree-element').append(deleteButtonJ)
			return

		onNodeClicked: (event)=>
			if event.node.file.type == 'tree'
				elementIsToggler = $(event.click_event.target).hasClass('jqtree-toggler')
				elementIsTitle = $(event.click_event.target).hasClass('jqtree-title-folder')
				if elementIsToggler or elementIsTitle
					@fileBrowserJ.tree('toggle', event.node)
				return
			if event.node.source?
				R.showCodeEditor(event.node)
			else
				@loadFile(event.node.file.path, @openFile)
			return

		### Load files ###

		getMasterBranch: ()->
			@commit = {}
			@request('https://api.github.com/repos/' + @owner + '/romanesco-client-code/branches/master', @getTree)
			return

		getTree: (master)=>
			master = @checkError(master)
			if not master then return
			if not master.commit?.commit?.tree?.url? then return R.alertManager.alert('Error reading master branch.', 'error')
			@runForkBtnJ.text(if @owner != 'arthursw' then @owner else 'Main repository')
			@commit.lastCommitSha = master.commit.sha
			@request(master.commit.commit.tree.url + '?recursive=1', @checkIfTreeExists)
			return

		# Create jqTree

		checkIfTreeExists: (content)=>
			content = @checkError(content)
			if not content then return
			savedGitTree = Utils.LocalStorage.get('files' + @owner)
			if savedGitTree?
				if savedGitTree.sha != content.sha
					modal = new Modal(title: 'Load uncommitted changes', submit: @readTree, data: savedGitTree)
					message = 'Do you want to load the changes which have not been committed yet (stored on your computer)?\n'
					message += '<strong>Warning: the repository has changed since you made the changes!</strong>\n'
					message += 'Consider checking the new version of the repository before committing your changes.'
					modal.addText(message)
					modal.show()
					@readTree(content)
				else
					@readTree(savedGitTree)
			else
				@readTree(content)
			return

		readTree: (content)=>
			@gitTree = content.data or content

			treeExists = @tree?

			tree = @buildTree(content.tree)

			if treeExists
				@fileBrowserJ.tree('loadData', tree.leaves.coffee.children)
			else
				@fileBrowserJ.tree(
					data: tree.leaves.coffee.children
					autoOpen: true
					dragAndDrop: true
					onCanMoveTo: @onCanMoveTo
					onCreateLi: @onCreateLi
				)
				@fileBrowserJ.bind('tree.click', @onNodeClicked)
				@fileBrowserJ.bind('tree.dblclick', @onNodeDoubleClicked)
				@fileBrowserJ.bind('tree.move', @onFileMove)

			@tree = @fileBrowserJ.tree('getTree')
			@tree.name = 'coffee'
			@tree.file =
				name: 'coffee'
				path: 'coffee'
				type: 'tree'
			@tree.id = content.tree.length
			@updateLeaves(@tree)
			return

		### Commit changes ###

		compileCoffee: ()->
			for file in @gitTree.tree
				if file.coffee?
					js = R.editor.compile(file.coffee.source)
					if not js? then return
					file.content = btoa(js)
					delete file.sha
			return

		filterTree: ()->
			tree = []
			for file in @gitTree.tree
				if file.type != 'tree'
					tree.push(file)
			return tree

		commitChanges: (data)=>
			@commit.message = data.commitMessage
			@compileCoffee()
			tree = @filterTree()
			@request('https://api.github.com/repos/' + @owner + '/romanesco-client-code/git/trees', @createCommit, 'post', tree)
			return

		createCommit: (tree)=>
			tree = @checkError(tree)
			if not tree then return
			data =
				message: @commit.message
				tree: tree.sha
				parent: @commit.lastCommitSha
			@request('https://api.github.com/repos/' + @owner + '/romanesco-client-code/git/commits', @updateHead, 'post', data)
			return

		updateHead: (commit)=>
			commit = @checkError(commit)
			if not commit then return
			@request('https://api.github.com/repos/' + @owner + '/romanesco-client-code/git/refs/master/HEAD', @checkCommit, 'patch', sha: commit.sha)
			return

		checkCommit: (commit)=>
			commit = @checkError(commit)
			if not commit then return
			R.alertManager.alert('Successfully committed!', 'success')
			Utils.LocalStorage.set('files:' + @owner, null)
			return

		# loadFiles: (content)=>

		# 	for file in content
		# 		@files.push(file)
		# 		if file.file.type == 'dir'
		# 			@nDirsToLoad++
		# 			@request(file.url, @loadFiles)

		# 	@nDirsToLoad--

		# 	if @nDirsToLoad == 0

		# 		@tree = @buildTree(@files)

		# 		jqTreeData = { children: [] }
		# 		@buildJqTree(@tree, jqTreeData)

		# 		@fileBrowserJ.tree(
		# 			data: jqTreeData.children
		# 			autoOpen: true
		# 			dragAndDrop: true
		# 			onCanMoveTo: (moved_node, target_node, position)-> return target_node.file.file.type == 'dir'
		# 		)

		# 	return
	#
	# class ModuleCreator
	#
	# 	constructor: ()->
	# 		return

		createButton: (content)->

			source = atob(content.content)

			expressions = CoffeeScript.nodes(source).expressions
			properties = expressions[0]?.args?[1]?.body?.expressions?[0]?.body?.expressions

			if not properties? then return

			for property in properties
				name = property.variable?.properties?[0]?.name?.value
				value = property.value?.base?.value
				if not (value? and name?) then continue
				switch name
					when 'label'
						label = value
					when 'description'
						description = value
					when 'iconURL'
						iconURL = value
					when 'category'
						category = value

			###
			iconResult = /@iconURL = (\'|\"|\"\"\")(.*)(\'|\"|\"\"\")/.exec(source)

			if iconResult? and iconResult.length>=2
				iconURL = iconResult[2]

			descriptionResult = /@description = (\'|\"|\"\"\")(.*)(\'|\"|\"\"\")/.exec(source)

			if descriptionResult? and descriptionResult.length>=2
				description = descriptionResult[2]

			labelResult = /@label = (\'|\"|\"\"\")(.*)(\'|\"|\"\"\")/.exec(source)

			if labelResult? and labelResult.length>=2
				label = labelResult[2]
			###
			file = content.path.replace('coffee/', '')
			file = '"' + file.replace('.coffee', '') + '"'
			console.log '{ name: ' + label + ', popoverContent: ' + description + ', iconURL: ' + iconURL + ', file: ' + file + ', category: ' + category + ' }'
			return

		createButtons: (pathDirectory)->
			for name, node of pathDirectory.leaves
				if node.type != 'tree'
					@loadFile(node.path, @createButton)
				else
					@createButtons(node)
			return

		loadButtons: ()->
			@createButtons(@tree.leaves['Items'].leaves['Paths'])
			return

		registerModule: (@module)->
			@loadFile(@tree.leaves['ModuleLoader'].path, @registerModuleInModuleLoader)
			return

		insertModule: (source, module, position)->
			line = JSON.stringify(module)
			source.insert(line, position)
			return

		registerModuleInModuleLoader: (content)=>
			content = @checkError(content)
			if not content then return
			source = atob(content.content)
			buttonsResult = /buttons = \[/.exec(source)

			if buttonsResult? and buttonsResult.length>1
				@insertModule(source, @module, buttonsResult[1])

			return

	# FileManager.ModuleCreator = ModuleCreator
	return FileManager
