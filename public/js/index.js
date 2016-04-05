$(function() {





  // app namespace

  var app = {
    storage: localStorage
  };





  // todo task constructor

  app.TodoTask = function(t) {
    var t = _.defaultsDeep(t, {
      title: '',
      done: false,
      isEditing: true,
      isNew: false
    });

    t.done = ko.observable(t.done);
    t.title = ko.observable(t.title);
    t.editingTitle = ko.observable();

    t.isEmpty = ko.pureComputed(function() {
      return t.editingTitle() ? false : true;
    });

    t.isNotEmpty = ko.pureComputed(function() {
      return !t.isEmpty();
    });

    t.isNew = ko.observable(t.isNew);
    t.isEditing = ko.observable(t.isEditing);

    t.value = ko.pureComputed({
      read: function() {
        return {
          title: t.title(),
          done: t.done(),
          isEditing: t.isEditing()
        }
      },
      write: function(v) {
        t.title(v.title);
        t.done(v.done);
      }
    });

    t.edit = function() {
      t.editingTitle(t.title());
      t.isEditing(true);
    };

    t.save = function() {
      t.title(t.editingTitle());
      t.isEditing(false);
    }

    t.cancel = function() {
      t.isEditing(false);
    }

    t.clear = function() {
      t.editingTitle('');
    }

    return t;
  }





  // todo app constructor

  app.Todo = function(td) {
    var td = _.defaultsDeep(td, {
      tasks: [],
      tasksSortOrder: 'asc',
    });

    td.tasks = ko.observableArray(_.map(td.tasks, app.TodoTask));
    td.tasksSortOrder = ko.observable(td.tasksSortOrder);

    td.thereIsTasks = ko.pureComputed(function() {
      return td.tasks().length > 0;
    })

    td.newTask = ko.observable(app.TodoTask({ isNew: true }));

    td.addNewTask = function() {
      var t = td.newTask();
      td.newTask(app.TodoTask({ isNew: true }));
      t.save();
      t.isNew(false);
      td.tasks.push(t);
    };

    td.removeTask = function(t) {
      td.tasks.remove(t);
    }

    td.sortedTasks = ko.pureComputed(function() {
      var order = td.tasksSortOrder();
      var tasks = _.sortBy(td.tasks(),
        function(t) { return t.title(); });

      return order === 'asc'
        ? tasks : _.reverse(tasks);
    });

    td.value = ko.pureComputed({
      read: function() {
        return {
          tasks: _.map(td.tasks(),
            function(t) { return t.value() }),
          tasksSortOrder: td.tasksSortOrder()
        };
      },
      write: function(v) {
        td.tasks(_.map(v, app.TodoTask));
      }
    });

    td.value.subscribe(function(v) {
      app.storage.setItem('todo', JSON.stringify(v));
    });

    return td;
  };





  // enter point

  // for development
  window.app = app;

  // create Todo
  app.todo = app.Todo(JSON.parse(app.storage.getItem('todo')));

  // apply Todo on index.html
  ko.applyBindings(app.todo);
});
