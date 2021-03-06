// Generated by CoffeeScript 1.12.7
(function() {
  define(['spacebrew'], function(SpacebrewLib) {
    var description, name, server, spacebrew;
    server = "localhost";
    name = "Romanesco";
    description = "Tipibot commands.";
    spacebrew = new Spacebrew.Client(server, name, description);
    spacebrew.onOpen = function() {
      console.log("Connected as " + spacebrew.name() + ".");
    };
    spacebrew.connect();
    spacebrew.addPublish("commands", "string", "");
    spacebrew.addPublish("command", "string", "");
    R.spacebrew = spacebrew;
    return spacebrew;
  });

}).call(this);
