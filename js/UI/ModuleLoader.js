// Generated by CoffeeScript 1.12.7
(function() {
  define(['UI/Button', 'UI/Code'], function(Button) {
    var ModuleLoader, buttons;
    ModuleLoader = {};
    buttons = [
      {
        name: 'Precise path',
        description: "This path offers precise controls, one can modify points along with their handles and their type.",
        iconURL: 'static/images/icons/inverted/editCurve.png',
        file: "Items/Paths/PrecisePaths/PrecisePath",
        category: void 0,
        favorite: true,
        order: 8
      }, {
        name: 'Dynamic brush',
        description: "The stroke width is function of the drawing speed: the faster the wider.",
        iconURL: void 0,
        file: "Items/Paths/PrecisePaths/SpeedPaths/DynamicBrush",
        category: void 0,
        favorite: true,
        order: 9
      }, {
        name: 'Thickness path',
        description: "The stroke width is function of the drawing speed: the faster the wider.",
        iconURL: 'static/images/icons/inverted/rollerBrush.png',
        file: "Items/Paths/PrecisePaths/SpeedPaths/ThicknessPath",
        category: void 0,
        favorite: true,
        order: 10
      }, {
        name: 'Ellipse',
        description: "Simple ellipse, circle by default (use shift key to draw an ellipse).\nUse special key (command on a mac, control otherwise) to avoid the shape to be centered on the first point.",
        iconURL: 'static/images/icons/inverted/circle.png',
        file: "Items/Paths/Shapes/EllipseShape",
        category: 'Shape',
        favorite: true,
        order: 11
      }, {
        name: 'Rectangle',
        description: "Simple rectangle, square by default (use shift key to draw a rectangle) which can have rounded corners.\nUse special key (command on a mac, control otherwise) to center the shape on the first point.",
        iconURL: 'static/images/icons/inverted/rectangle.png',
        file: "Items/Paths/Shapes/RectangleShape",
        category: 'Shape',
        favorite: true,
        order: 12
      }, {
        name: 'Geometric lines',
        description: "Draws a line between pair of points which are close enough.",
        iconURL: 'static/images/icons/inverted/links.png',
        file: "Items/Paths/PrecisePaths/GeometricLines",
        category: void 0
      }, {
        name: 'Meander',
        description: "As Karl Kerenyi pointed out, \"the meander is the figure of a labyrinth in linear form\".\nA meander or meandros (Greek: ÎÎ±Î¯Î±Î½Î´ÏÎ¿Ï) is a decorative border constructed from a continuous line, shaped into a repeated motif.\nSuch a design is also called the Greek fret or Greek key design, although these are modern designations.\n(source: http://en.wikipedia.org/wiki/Meander_(art))",
        iconURL: 'static/images/icons/inverted/squareSpiral.png',
        file: "Items/Paths/PrecisePaths/Meander",
        category: void 0
      }, {
        name: 'Spiral',
        description: "The spiral shape can have an intern radius, and a custom number of sides.",
        iconURL: 'static/images/icons/inverted/spiral.png',
        file: "Items/Paths/Shapes/SpiralShape",
        category: 'Shape/Animated/Spiral'
      }, {
        name: 'Star',
        description: "Draws a star which can be animated (the color changes and it rotates).",
        iconURL: 'static/images/icons/inverted/star.png',
        file: "Items/Paths/Shapes/StarShape",
        category: 'Shape/Animated'
      }, {
        name: 'Shape path',
        description: "Draws rectangles or ellipses along the path. The size of the shapes is function of the drawing speed.",
        iconURL: void 0,
        file: "Items/Paths/PrecisePaths/SpeedPaths/ShapePath",
        category: void 0
      }, {
        name: 'Grid path',
        description: "Draws a grid along the path, the thickness of the grid being function of the speed of the drawing.",
        iconURL: void 0,
        file: "Items/Paths/PrecisePaths/SpeedPaths/GridPath",
        category: void 0
      }, {
        name: 'Pen',
        description: "The classic and basic pen tool",
        iconURL: void 0,
        file: "Items/Paths/Path",
        category: void 0
      }, {
        name: 'Paint brush',
        description: "Paints a thick stroke with customable blur effects.",
        iconURL: 'static/images/icons/inverted/brush.png',
        file: "Items/Paths/PrecisePaths/PainBrush",
        category: void 0
      }, {
        name: 'Paint gun',
        description: "The stroke width is function of the drawing speed: the faster the wider.",
        iconURL: void 0,
        file: "Items/Paths/PrecisePaths/SpeedPaths/PaintGun",
        category: void 0
      }, {
        name: 'Checkpoint',
        description: "Draw checkpoints on a lock with a Racer to create a race\n(the players must go through each checkpoint as fast as possible, with the car tool).",
        iconURL: void 0,
        file: "Items/Paths/Shapes/Checkpoint",
        category: 'Video game/Racer'
      }, {
        name: 'Medusa',
        description: "Creates a bunch of aniamted Medusa.",
        iconURL: void 0,
        file: "Items/Paths/Shapes/Medusa",
        category: void 0
      }, {
        name: 'Stripe animation',
        description: "Creates a stripe animation from a set sequence of image.",
        iconURL: void 0,
        file: "Items/Paths/Shapes/StripeAnimation",
        category: void 0
      }, {
        name: 'Space path',
        description: "Precise path which sends draw commands to spacebrew.",
        iconURL: void 0,
        file: "Items/Paths/PrecisePaths/SpacePath",
        category: 'Spacebrew'
      }, {
        name: 'Space colony',
        description: "Space colony algorithm.",
        iconURL: void 0,
        file: "Items/Paths/Shapes/SpaceColony",
        category: 'Spacebrew'
      }, {
        name: 'Square fractal',
        description: "Square fractal.",
        iconURL: void 0,
        file: "Items/Paths/Shapes/SquareFractal",
        category: void 0
      }, {
        name: 'Vectorizer',
        description: "Creates a vectorized version of an image.",
        iconURL: void 0,
        file: "Items/Paths/Shapes/Vectorizer",
        category: void 0
      }, {
        name: 'Striper',
        description: "Creates stripes from SVG",
        iconURL: void 0,
        file: "Items/Paths/Shapes/Striper",
        category: void 0
      }, {
        name: 'Vector field',
        description: "Creates a vector field",
        iconURL: void 0,
        file: "Items/Paths/Shapes/VectorField",
        category: void 0
      }, {
        name: 'Vector field GL',
        description: "Creates a vector field with three.js",
        iconURL: void 0,
        file: "Scripts/VectorFieldGL",
        category: void 0
      }, {
        name: 'Totem',
        description: "Blabl",
        iconURL: void 0,
        file: "Items/Paths/Shapes/TotemShape",
        category: 'Shape/Animated/Spiral'
      }
    ];
    ModuleLoader.initialize = function() {
      var b, button, i, len;
      for (i = 0, len = buttons.length; i < len; i++) {
        button = buttons[i];
        b = new Button(button);
      }
    };
    ModuleLoader.load = function(name, callback) {
      var button, i, len;
      for (i = 0, len = buttons.length; i < len; i++) {
        button = buttons[i];
        if (button.name === name) {
          require([button.file], callback);
          return;
        }
      }
      console.log('unknown module: ' + name);
    };
    return ModuleLoader;
  });

}).call(this);
