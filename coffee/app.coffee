libs = '../../libs/'
# Place third party dependencies in the lib folder
#
# Configure loading modules from the lib directory,
# except 'app' ones,
requirejs.config
	baseUrl: '../static/romanesco-client-code/js'
	# enforceDefine: true 	# to make fallback work?? but throws Uncaught Error: No define call for app
	paths:
		'domReady': ['//cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min', libs + 'domReady']
		'ace': ['//cdnjs.cloudflare.com/ajax/libs/ace/1.1.9/', libs + 'ace/src-min-noconflict/']
		'underscore': ['//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min', libs + 'underscore-min']
		'jquery': ['//code.jquery.com/jquery-2.1.3.min', 'libs/jquery-2.1.3.min']
		'jqueryUi': ['//code.jquery.com/ui/1.11.4/jquery-ui.min', libs + 'jquery-ui.min']
		'mousewheel': ['//cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.12/jquery.mousewheel.min', libs + 'jquery.mousewheel.min']
		'scrollbar': ['//cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.0.8/jquery.mCustomScrollbar.min', libs + 'jquery.mCustomScrollbar.min']
		'tinycolor': ['//cdnjs.cloudflare.com/ajax/libs/tinycolor/1.1.2/tinycolor.min', libs + 'tinycolor.min']
		# 'socketio': '//cdn.socket.io/socket.io-1.3.4'
		# 'socketio': '//cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.5/socket.io'
		'prefix': ['//cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min']
		'bootstrap': ['//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min', libs + 'bootstrap.min']
		# 'modal': ['//cdnjs.cloudflare.com/ajax/libs/bootstrap-modal/2.2.5/js/bootstrap-modal.min', 'libs/bootstrap-modal.min']
		# 'modalManager': ['//cdnjs.cloudflare.com/ajax/libs/bootstrap-modal/2.2.5/js/bootstrap-modalmanager.min', 'libs/bootstrap-modalmanager.min']
		# 'paper': ['//cdnjs.cloudflare.com/ajax/libs/paper.js/0.9.22/paper-full.min', 'libs/paper-full.min']
		'paper': ['//cdnjs.cloudflare.com/ajax/libs/paper.js/0.9.22/paper-full', libs + 'paper-full']
		'gui': ['//cdnjs.cloudflare.com/ajax/libs/dat-gui/0.5/dat.gui', libs + 'dat.gui.min']
		'typeahead': ['//cdnjs.cloudflare.com/ajax/libs/typeahead.js/0.10.4/typeahead.bundle.min', libs + 'typeahead.bundle.min']
		'howler': ['//cdnjs.cloudflare.com/ajax/libs/howler/1.1.26/howler.min', libs + 'howler']
		'spin': ['//cdnjs.cloudflare.com/ajax/libs/spin.js/2.0.1/spin.min', libs + 'spin.min']
		'pinit': ['//assets.pinterest.com/js/pinit', libs + 'pinit']
		'table': ['//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.8.1/bootstrap-table.min', libs + 'table']
		'zeroClipboard': ['//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.2.0/ZeroClipboard.min', libs + 'ZeroClipboard.min']


		# 'domReady': [libs + 'domReady']
		# 'ace': [libs + 'ace']
		# 'aceTools': [libs + 'ace/ext-language_tools']
		# 'underscore': [libs + 'underscore-min']
		# 'jquery': [libs + 'jquery-2.1.3.min']
		# 'jqueryUi': [libs + 'jquery-ui.min']
		# 'mousewheel': [libs + 'jquery.mousewheel.min']
		# 'scrollbar': [libs + 'jquery.mCustomScrollbar.min']
		# 'tinycolor': [libs + 'tinycolor.min']
		# # 'socketio': '//cdn.socket.io/socket.io-1.3.4'
		# # 'socketio': '//cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.5/socket.io'
		# # 'prefix': ['//cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min']
		# 'bootstrap': [libs + 'bootstrap.min']
		# # 'modal': ['//cdnjs.cloudflare.com/ajax/libs/bootstrap-modal/2.2.5/js/bootstrap-modal.min', libs + 'bootstrap-modal.min']
		# # 'modalManager': ['//cdnjs.cloudflare.com/ajax/libs/bootstrap-modal/2.2.5/js/bootstrap-modalmanager.min', libs + 'bootstrap-modalmanager.min']
		# # 'paper': ['//cdnjs.cloudflare.com/ajax/libs/paper.js/0.9.22/paper-full.min', libs + 'paper-full.min']
		# 'paper': [libs + 'paper-full']
		# 'gui': [libs + 'dat.gui.min']
		# 'typeahead': [libs + 'typeahead.bundle.min']
		# 'pinit': [libs + 'pinit']
		# 'howler': [libs + 'howler']
		# 'spin': [libs + 'spin.min']
		#
		# 'zeroClipboard': [libs + 'ZeroClipboard.min']


		'colorpickersliders': libs + 'bootstrap-colorpickersliders/bootstrap.colorpickersliders.nocielch'
		'requestAnimationFrame': libs + 'RequestAnimationFrame'
		'coffee': libs + 'coffee-script'
		'tween': libs + 'tween.min'
		'socketio': libs + 'socket.io'
		'oembed': libs + 'jquery.oembed'
		'jqtree': libs + 'jqtree/tree.jquery'
		'js-cookie': libs + 'js.cookie'
		'octokat': libs + 'octokat'

	shim:
		'oembed': ['jquery']
		'mousewheel': ['jquery']
		'scrollbar': ['jquery']
		'jqueryUi': ['jquery']
		'bootstrap': ['jquery']
		'typeahead': ['jquery']
		'js-cookie': ['jquery']
		'jqtree': ['jquery']
		# 'modal': ['bootstrap', 'modalManager']
		'colorpickersliders':
			deps: ['jquery', 'tinycolor']
		# 'ace': ['aceTools']
		'underscore':
			exports: '_'
		'jquery':
			exports: '$'

window.R = {}
window.P = {}
R.DajaxiceXMLHttpRequest = window.XMLHttpRequest
window.XMLHttpRequest = window.RXMLHttpRequest

# Load the main app module to start the app
requirejs [ 'main' ]
