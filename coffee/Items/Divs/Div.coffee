define [ 'Content' ], (Content) ->

	# todo: change ownership through websocket?
	# todo: change lock/link popover to romanesco alert?

	# RDiv is a div on top of the canvas (i.e. on top of the paper.js project) which can be resized, unless it is locked
	# it is lock if it is owned by another user
	#
	# There are different RDivs, with different content:
	#     they define areas which can only be modified by a single user (the one who created the); all RItems in the area is the property of this user
	# - RText: a textarea to write some text. The text can have any google font, any effect, but the whole text has the same formating.
	# - RMedia: an image, video or any content inside an iframe (can be a [shadertoy](https://www.shadertoy.com/))
	# - RSelectionRectangle: a special div just to defined a selection rectangle, user by {ScreenshotTool}
	#
	class Div extends Content

		@zIndexMin = 1
		@zIndexMax = 100000

		# parameters are defined as in {RTool}
		@initializeParameters: ()->
			parameters = super()

			strokeWidth = $.extend(true, {}, R.parameters.strokeWidth)
			strokeWidth.default = 1
			strokeColor = $.extend(true, {}, R.parameters.strokeColor)
			strokeColor.default = 'black'

			parameters['Style'].strokeWidth = strokeWidth
			parameters['Style'].strokeColor = strokeColor

			return parameters

		@parameters = @initializeParameters()
		@createTool(@)

		@updateHiddenDivs: (event)->
			if R.hiddenDivs.length > 0
				point = new P.Point(event.pageX, event.pageY)
				projectPoint = P.view.viewToProject(point)
				for div in R.hiddenDivs
					if not div.getBounds().contains(projectPoint)
						div.show()
			return

		@showDivs: ()->
			while R.hiddenDivs.length > 0
				R.hiddenDivs[0].show()
			return

		@updateZIndex: (sortedDivs)->
			for div, i in sortedDivs
				div.divJ.css( 'z-index': i )
			return

		# add the div jQuery element (@divJ) on top of the canvas and intialize it
		# initialize @data
		# @param bounds [Paper P.Rectangle] the bounding box of the div (@rectangle extended depending on the rotation)
		# @param rectangle [Paper P.Rectangle]  the rectangle which defines the div position and size
		# @param owner [String] the username of the owner of the div
		# @param pk [ID] the primary key of the div
		# @param lock [Boolean] (optional) whether the pk of the lock (if locked)
		# @param data [Object] the data of the div (containing the stroke width, colors, etc.)
		# @param date [Number] the date of the div (used as zindex)
		constructor: (bounds, @data=null, @pk=null, @date, @lock=null) ->
			# @rectangle is equal to bounds when creating it, and is stored in @data.rectangle when loading it
			@rectangle = if @data?.rectangle? then new P.Rectangle(@data.rectangle) else bounds

			@controller = this
			@object_type = @constructor.object_type

			# initialize @divJ: main jQuery element of the div
			separatorJ = R.stageJ.find("." + @object_type + "-separator")
			@divJ = R.templatesJ.find(".custom-div").clone().insertAfter(separatorJ)

			@divJ.mouseenter (event)=>
				for item in R.selectedItems
					if item != @ and item.getBounds().intersects(@getBounds())
						@hide()
						break
				return

			if not @lock
				super(@data, @pk, @date, R.divList, R.sortedDivs)
			else
				super(@data, @pk, @date, @lock.itemListsJ.find('.rDiv-list'), @lock.sortedDivs)

			@maskJ = @divJ.find(".mask")

			@divJ.css(width: @rectangle.width, height: @rectangle.height)

			@updateTransform(false)

			if @owner != R.me and @lock? 	# lock div it is not mine and it is locked
				@divJ.addClass("locked")

			@divJ.attr("data-pk",@pk)

			@divJ.controller = @
			@setCss()

			R.divs.push(@)

			if R.selectedTool.name == 'Move' then @disableInteraction()

			@divJ.click (event)=>
				if @selectionRectangle? then return
				if not event.shiftKey
					Tool.Select.deselectAll()
				@select()
				return

			if not bounds.contains(@rectangle.expand(-1))
				console.log "Error: invalid div"
				@remove()

			return

		hide: ()->
			@divJ.css( opacity: 0.5, 'pointer-events': 'none' )
			R.hiddenDivs.push(@)
			return

		show: ()->
			@divJ.css( opacity: 1, 'pointer-events': 'auto' )
			Utils.Array.remove(R.hiddenDivs, @)
			return

		save: (addCreateCommand=true) ->
			if Grid.rectangleOverlapsTwoPlanets(@rectangle)
				return

			if @rectangle.area == 0
				@remove()
				R.alertManager.alert "Error: your div is not valid.", "error"
				return

			args =
				city: R.city
				box: R.boxFromRectangle(@getBounds())
				object_type: @object_type
				date: Date.now()
				data: @getStringifiedData()

			Dajaxice.draw.saveDiv(@saveCallback, args)
			super
			return

		# check if the save was successful and set @pk if it is
		saveCallback: (result)=>
			R.loader.checkError(result)
			if not result.pk?  		# if @pk is null, the path was not saved, do not set pk nor rasterize
				@remove()
				return
			@owner = result.owner
			@setPK(result.pk)
			if @updateAfterSave?
				@update(@updateAfterSave)
			super
			return

		moveTo: (position, update)->
			super(position, update)
			@updateTransform()
			return

		setRectangle: (rectangle, update)->
			super(rectangle, update)
			@updateTransform()
			return

		setRotation: (rotation, update)->
			super(rotation, update)
			@updateTransform()
			return

		# update the scale and position of the RDiv (depending on its position and scale, and the view position and scale)
		# if zoom equals 1, do no use css translate() property to avoid blurry text
		updateTransform: ()->
			# the css of the div in styles.less: transform-origin: 0% 0% 0

			viewPos = P.view.projectToView(@rectangle.topLeft)
			# viewPos = new P.Point( -R.offset.x + @position.x, -R.offset.y + @position.y )
			if P.view.zoom == 1 and ( @rotation == 0 or not @rotation? )
				@divJ.css( 'left': viewPos.x, 'top': viewPos.y, 'transform': 'none' )
			else
				sizeScaled = @rectangle.size.multiply(P.view.zoom)
				translation = viewPos.add(sizeScaled.divide(2))
				css = 'translate(' + translation.x + 'px,' + translation.y + 'px)'
				css += 'translate(-50%, -50%)'
				css += ' scale(' + P.view.zoom + ')'
				if @rotation then css += ' rotate(' + @rotation + 'deg)'

				@divJ.css( 'transform': css, 'top': 0, 'left': 0, 'transform-origin': '50% 50%' )

				# css = 'translate(' + viewPos.x + 'px,' + viewPos.y + 'px)'
				# css += ' scale(' + P.view.zoom + ')'

				# @divJ.css( 'transform': css, 'top': 0, 'left': 0 )

			@divJ.css( width: @rectangle.width, height: @rectangle.height )

			return

		# insert above given *div*
		# @param div [RDiv] div on which to insert this
		# @param index [Number] the index at which to add the div in R.sortedDivs
		insertAbove: (div, index=null, update=false)->
			super(div, index, update)
			if not index then @constructor.updateZIndex(@sortedItems)
			return

		# insert below given *div*
		# @param div [RDiv] div under which to insert this
		# @param index [Number] the index at which to add the div in R.sortedDivs
		insertBelow: (div, index=null, update=false)->
			super(div, index, update)
			if not index then @constructor.updateZIndex(@sortedItems)
			return

		beginSelect: (event) =>
			super(event)
			if @selectionState? then R.currentDiv = @
			return

		endSelect: (event) =>
			super(event)
			R.currentDiv = null
			return

		# mouse interaction must be disabled when user has the move tool (a click on an RDiv must not start a resize action)
		# disable user interaction on this div by putting a transparent mask (div) on top of the div
		disableInteraction: () ->
			@maskJ.show()
			return

		# see {RDiv#disableInteraction}
		# enable user interaction on this div by hiding the mask (div)
		enableInteraction: () ->
			@maskJ.hide()
			return

		# called when a parameter is changed:
		# - from user action (parameter.onChange)
		# @param name [String] the name of the value to change
		# @param value [Anything] the new value
		setParameter: (controller, value)->
			super(controller, value)
			switch controller.name
				when 'strokeWidth', 'strokeColor', 'fillColor'
					@setCss()
			return

		getUpdateFunction: ()->
			return 'updateDiv'

		getUpdateArguments: (type)->
			switch type
				when 'z-index'
					args = pk: @pk, date: @date
				else
					args =
						pk: @pk
						box: R.boxFromRectangle(@getBounds())
						data: @getStringifiedData()
			return args

		# update the RDiv in the database
		update: (type) =>
			if not @pk?
				@updateAfterSave = type
				return
			delete @updateAfterSave

			bounds = @getBounds()

			# check if position is valid
			if Grid.rectangleOverlapsTwoPlanets(bounds)
				return

			Dajaxice.draw.updateDiv( @updateCallback, @getUpdateArguments(type) )

			return

		updateCallback: (result)->
			R.loader.checkError(result)
			return

		select: (updateOptions, updateSelectionRectangle=true) =>
			if not super(updateOptions, updateSelectionRectangle) or @divJ.hasClass("selected") then return false
			if R.selectedTool != R.tools['Select'] then R.tools['Select'].select()
			@divJ.addClass("selected")
			return true

		# common to all RItems
		# deselect the div
		deselect: () =>
			if not super() then return false
			if not @divJ.hasClass("selected") then return
			@divJ?.removeClass("selected")
			return true

		# update basic apparence parameters (fill color, stroke color and stroke width) from @data
		setCss: ()->
			@setFillColor()
			@setStrokeColor()
			@setStrokeWidth()
			return

		# update fill color from @data.fillColor
		setFillColor: ()->
			@contentJ?.css( 'background-color': @data.fillColor ? 'transparent')
			return

		# update stroke color from @data.strokeColor
		setStrokeColor: ()->
			@contentJ?.css( 'border-color': @data.strokeColor ? 'transparent')
			return

		# update stroke width from @data.strokeWidth
		setStrokeWidth: ()->
			@contentJ?.css( 'border-width': @data.strokeWidth ? '0')
			return

		# common to all RItems
		# called by @delete() and to update users view through websockets
		# @delete() removes the path and delete it in the database
		# @remove() just removes visually
		remove: () ->
			@deselect()
			@divJ.remove()
			Utils.Array.remove(R.divs, @)
			if @data.loadEntireArea then Utils.Array.remove(R.entireAreas, @)
			if R.divToUpdate==@ then delete R.divToUpdate
			super()
			return

		# called when user deletes the item by pressing delete key or from the gui
		# @delete() removes the path and delete it in the database
		# @remove() just removes visually
		delete: () ->
			if @lock? and @lock.owner != R.me then return
			@remove()
			if not @pk? then return
			if not @socketAction then Dajaxice.draw.deleteDiv( R.loader.checkError, { 'pk': @pk } )
			super
			return

	return Div