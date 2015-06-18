define [ 'utils' ], () ->

	class Button

		constructor: (name, iconURL, favorite, category=null, parentJ)->
			parentJ ?= R.allToolsJ
			if category? and category != ""
				# split into sub categories
				categories = category.split("/")

				for category in categories
					# look for category
					ulJ = parentJ.find("li[data-name='#{category}'] > ul")
					if ulJ.length==0
						liJ = $("<li data-name='#{category}'>")
						liJ.addClass('category')
						hJ = $('<h6>')
						hJ.text(category).addClass("title")
						liJ.append(hJ)
						ulJ = $("<ul>")
						ulJ.addClass('folder')
						liJ.append(ulJ)
						hJ.click (event)->
							$(this).parent().toggleClass('closed')
							return
						parentJ.append(liJ)

					parentJ = ulJ

			# initialize button
			btnJ = $("<li>")
			btnJ.attr("data-name", name)
			# @btnJ.attr("data-cursor", @cursorDefault)
			btnJ.attr("alt", name)

			if iconURL? and iconURL != '' 															# set icon if url is provided
				if iconURL.indexOf('//') < 0 and iconURL.indexOf('static/images/icons/inverted/') < 0
					iconURL = 'static/images/icons/inverted/' + iconURL
				btnJ.append('<img src="' + iconURL + '" alt="' + name + '-icon">')
			else 																					# create icon if url is not provided
				btnJ.addClass("text-btn")
				words = name.split(" ")
				shortName = ""
																# the icon will be made with
				if words.length>1 								# the first letter of each words of the name
					shortName += word.substring(0,1) for word in words
				else 											# or the first two letters of the name (if it has only one word)
					shortName += name.substring(0,2)
				shortNameJ = $('<span class="short-name">').text(shortName + ".")
				btnJ.append(shortNameJ)

			parentJ.append(btnJ)

			toolNameJ = $('<span class="tool-name">').text(name)
			btnJ.append(toolNameJ)
			btnJ.addClass("tool-btn")
			favoriteBtnJ = $("""<button type="button" class="btn btn-default favorite-btn">
	  			<span class="glyphicon glyphicon-star" aria-hidden="true"></span>
			</button>""")
			favoriteBtnJ.click(R.toggleToolToFavorite)

			btnJ.append(favoriteBtnJ)

			if favorite
				R.toggleToolToFavorite(null, btnJ)

			return

	R.toggleToolToFavorite = (event, btnJ)->
		if not btnJ?
			event.stopPropagation()
			targetJ = $(event.target)
			btnJ = targetJ.parents("li.tool-btn:first")

		toolName = btnJ.attr("data-name")

		if btnJ.hasClass("selected")
			btnJ.removeClass("selected")
			R.favoriteToolsJ.find("[data-name='#{toolName}']").remove()
			Utils.Array.remove(R.favoriteTools, toolName)
		else
			btnJ.addClass("selected")
			cloneJ = btnJ.clone()
			R.favoriteToolsJ.append(cloneJ)
			cloneJ.click (event)->
				toolName = $(this).attr("data-name")
				R.tools[toolName]?.select()
				return
			R.favoriteTools.push(toolName)

		if not localStorage? then return
		names = []
		for li in R.favoriteToolsJ.children()
			names.push($(li).attr("data-name"))
		localStorage.favorites = JSON.stringify(names)

		return


	# Toggle (hide/show) sidebar (called when user clicks on the sidebar handle)
	# @param show [Boolean] show the sidebar, defaults to the opposite of the current state (true if hidden, false if shown)
	R.toggleSidebar = (show)->
		show ?= not R.sidebarJ.hasClass("r-hidden")
		if show
			R.sidebarJ.addClass("r-hidden")
			R.codeEditor.editorJ.addClass("r-hidden")
			R.alertsContainer.addClass("r-sidebar-hidden")
			R.sidebarHandleJ.find("span").removeClass("glyphicon-chevron-left").addClass("glyphicon-chevron-right")
		else
			R.sidebarJ.removeClass("r-hidden")
			R.codeEditor.editorJ.removeClass("r-hidden")
			R.alertsContainer.removeClass("r-sidebar-hidden")
			R.sidebarHandleJ.find("span").removeClass("glyphicon-chevron-right").addClass("glyphicon-chevron-left")
		return

	# R.createToolButton = (name, iconURL, favorite, category=null, parentJ)->

	return Button: Button, Sidebar: Sidebar