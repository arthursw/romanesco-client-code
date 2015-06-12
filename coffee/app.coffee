# Place third party dependencies in the lib folder
#
# Configure loading modules from the lib directory,
# except 'app' ones,
requirejs.config
	baseUrl: '../static/js'
	paths:
		'ace': ['//cdnjs.cloudflare.com/ajax/libs/ace/1.1.9/ace', '../libs/ace']
		'aceTools': ['//cdnjs.cloudflare.com/ajax/libs/ace/1.1.9/ext-language_tools', '../libs/ace/ext-language_tools']
		'underscore': ['//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min', '../libs/underscore-min']
		'jquery': ['//code.jquery.com/jquery-2.1.3.min', '../libs/jquery-2.1.3.min']
		'jqueryUi': ['//code.jquery.com/ui/1.11.4/jquery-ui.min', '../libs/jquery-ui.min']
		'mousewheel': ['//cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.12/jquery.mousewheel.min', '../libs/jquery.mousewheel.min']
		'scrollbar': ['//cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.0.8/jquery.mCustomScrollbar.min', '../libs/jquery.mCustomScrollbar.min']
		'tinycolor': ['//cdnjs.cloudflare.com/ajax/libs/tinycolor/1.1.2/tinycolor.min', '../libs/tinycolor.min']
		# 'socketio': '//cdn.socket.io/socket.io-1.3.4'
		# 'socketio': '//cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.5/socket.io'
		'prefix': ['//cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min']
		'bootstrap': ['//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min', '../libs/bootstrap.min']
		# 'modal': ['//cdnjs.cloudflare.com/ajax/libs/bootstrap-modal/2.2.5/js/bootstrap-modal.min', '../libs/bootstrap-modal.min']
		# 'modalManager': ['//cdnjs.cloudflare.com/ajax/libs/bootstrap-modal/2.2.5/js/bootstrap-modalmanager.min', '../libs/bootstrap-modalmanager.min']
		# 'paper': ['//cdnjs.cloudflare.com/ajax/libs/paper.js/0.9.22/paper-full.min', '../libs/paper-full.min']
		'paper': ['//cdnjs.cloudflare.com/ajax/libs/paper.js/0.9.22/paper-full', '../libs/paper-full']
		'gui': ['//cdnjs.cloudflare.com/ajax/libs/dat-gui/0.5/dat.gui', '../libs/dat.gui.min']
		'typeahead': ['//cdnjs.cloudflare.com/ajax/libs/typeahead.js/0.10.4/typeahead.bundle.min', '../libs/typeahead.bundle.min']
		'pinit': ['//assets.pinterest.com/js/pinit', '../libs/pinit']

		'zeroClipboard': ['//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.2.0/ZeroClipboard.min', '../libs/ZeroClipboard.min']



		# 'ace': ['../libs/ace']
		# 'aceTools': ['../libs/ace/ext-language_tools']
		# 'underscore': ['../libs/underscore-min']
		# 'jquery': ['../libs/jquery-2.1.3.min']
		# 'jqueryUi': ['../libs/jquery-ui.min']
		# 'mousewheel': ['../libs/jquery.mousewheel.min']
		# 'scrollbar': ['../libs/jquery.mCustomScrollbar.min']
		# 'tinycolor': ['../libs/tinycolor.min']
		# # 'socketio': '//cdn.socket.io/socket.io-1.3.4'
		# # 'socketio': '//cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.5/socket.io'
		# # 'prefix': ['//cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min']
		# 'bootstrap': ['../libs/bootstrap.min']
		# # 'modal': ['//cdnjs.cloudflare.com/ajax/libs/bootstrap-modal/2.2.5/js/bootstrap-modal.min', '../libs/bootstrap-modal.min']
		# # 'modalManager': ['//cdnjs.cloudflare.com/ajax/libs/bootstrap-modal/2.2.5/js/bootstrap-modalmanager.min', '../libs/bootstrap-modalmanager.min']
		# # 'paper': ['//cdnjs.cloudflare.com/ajax/libs/paper.js/0.9.22/paper-full.min', '../libs/paper-full.min']
		# 'paper': ['../libs/paper-full']
		# 'gui': ['../libs/dat.gui.min']
		# 'typeahead': ['../libs/typeahead.bundle.min']
		# 'pinit': ['../libs/pinit']

		# 'zeroClipboard': ['../libs/ZeroClipboard.min']



		'colorpickersliders': '../libs/bootstrap-colorpickersliders/bootstrap.colorpickersliders.nocielch'
		'requestAnimationFrame': '../libs/RequestAnimationFrame'
		'coffee': '../libs/coffee-script'
		'tween': '../libs/tween.min'
		'socketio': '../libs/socket.io'
		'oembed': '../libs/jquery.oembed'
		'jqtree': '../libs/jqtree/tree.jquery'
		'mod': 'module'

	shim:
		'oembed': ['jquery']
		'mousewheel': ['jquery']
		'scrollbar': ['jquery']
		'jqueryUi': ['jquery']
		'bootstrap': ['jquery']
		'typeahead': ['jquery']
		# 'modal': ['bootstrap', 'modalManager']
		'colorpickersliders': ['jquery', 'tinycolor']
		# 'ace': ['aceTools']
		'underscore':
			exports: '_'
		'jquery':
			exports: '$'

# Load the main app module to start the app
requirejs [ 'main' ]