$(function() {

  var app = {};

  app.Todo = function() {
    var t = {};

    

    return t;
  };

  app.todo = app.Todo();
  ko.applyBindings(app.todo);

  // for develop
  window.app = app;
});
