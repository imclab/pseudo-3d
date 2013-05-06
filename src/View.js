// Generated by CoffeeScript 1.3.3
var View;

View = (function() {
  var ViewMatrix, isVisible, showIfVisible;

  function View() {}

  View.setRooms = function(rooms) {
    return ViewMatrix.setRooms(rooms);
  };

  isVisible = function(dir, room) {
    return room != null ? room.boundaries[dir] : void 0;
  };

  showIfVisible = function(dir, room, piece) {
    if (isVisible(dir, room)) {
      return View.Utils.show(piece);
    }
  };

  View.update = function(player) {
    var heading, matrix, paths;
    matrix = ViewMatrix.calculate(player);
    paths = {
      front: [matrix[0][1], matrix[1][1], matrix[2][2]],
      left: [matrix[0][0], matrix[1][0], matrix[2][1]],
      right: [matrix[0][2], matrix[1][2], matrix[2][3]],
      extents: {
        left: matrix[2][0],
        right: matrix[2][4]
      }
    };
    heading = player.orientation;
    player.boundaries = paths.front[0].boundaries;
    this.Utils.hideGroup(this.Pieces.frontPieces);
    showIfVisible(heading.forward, paths.front[0], this.Pieces.frontPieces[1]);
    showIfVisible(heading.forward, paths.front[1], this.Pieces.frontPieces[4]);
    showIfVisible(heading.forward, paths.front[2], this.Pieces.frontPieces[7]);
    showIfVisible(heading.forward, paths.left[0], this.Pieces.frontPieces[0]);
    showIfVisible(heading.forward, paths.left[1], this.Pieces.frontPieces[3]);
    showIfVisible(heading.forward, paths.left[2], this.Pieces.frontPieces[6]);
    showIfVisible(heading.forward, paths.right[0], this.Pieces.frontPieces[2]);
    showIfVisible(heading.forward, paths.right[1], this.Pieces.frontPieces[5]);
    showIfVisible(heading.forward, paths.right[2], this.Pieces.frontPieces[8]);
    showIfVisible(heading.forward, paths.extents.left, this.Pieces.frontPieces[9]);
    showIfVisible(heading.forward, paths.extents.right, this.Pieces.frontPieces[10]);
    this.Utils.hideGroup(this.Pieces.sidePieces);
    showIfVisible(heading.right, paths.front[0], this.Pieces.sidePieces[2]);
    showIfVisible(heading.right, paths.front[1], this.Pieces.sidePieces[6]);
    showIfVisible(heading.right, paths.front[2], this.Pieces.sidePieces[10]);
    showIfVisible(heading.left, paths.front[0], this.Pieces.sidePieces[1]);
    showIfVisible(heading.left, paths.front[1], this.Pieces.sidePieces[5]);
    showIfVisible(heading.left, paths.front[2], this.Pieces.sidePieces[9]);
    return paths;
  };

  View.Pieces = (function() {

    function Pieces() {}

    Pieces.keys = ['floor', 'ceiling', 'side', 'front'];

    Pieces.getClass = function(className) {
      return (document.getElementsByClassName(className) || [])[0].children;
    };

    Pieces.floorPieces = Pieces.getClass(Pieces.keys[0]);

    Pieces.ceilingPieces = Pieces.getClass(Pieces.keys[1]);

    Pieces.sidePieces = Pieces.getClass(Pieces.keys[2]);

    Pieces.frontPieces = Pieces.getClass(Pieces.keys[3]);

    Pieces.allPieces = {
      floor: Pieces.floorPieces,
      ceiling: Pieces.ceilingPieces,
      side: Pieces.sidePieces,
      front: Pieces.frontPieces
    };

    return Pieces;

  })();

  View.Utils = (function() {

    function Utils() {}

    Utils.hide = function(e) {
      return e.style.display = 'none';
    };

    Utils.show = function(e) {
      return e.style.display = 'block';
    };

    Utils.hideGroup = function(pieces) {
      var piece, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = pieces.length; _i < _len; _i++) {
        piece = pieces[_i];
        _results.push(View.Utils.hide(piece));
      }
      return _results;
    };

    Utils.showGroup = function(pieces) {
      var piece, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = pieces.length; _i < _len; _i++) {
        piece = pieces[_i];
        _results.push(View.Utils.show(piece));
      }
      return _results;
    };

    Utils.hideAll = function() {
      var key, _i, _len, _ref, _results;
      _ref = View.Pieces.keys;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        _results.push(View.Utils.hideGroup(View.Pieces.allPieces[key]));
      }
      return _results;
    };

    Utils.showAll = function() {
      var key, _i, _len, _ref, _results;
      _ref = View.Pieces.keys;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        _results.push(View.Utils.showGroup(View.Pieces.allPieces[key]));
      }
      return _results;
    };

    return Utils;

  })();

  ViewMatrix = (function() {
    var directions, steps;

    function ViewMatrix() {}

    ViewMatrix.setRooms = function(rooms) {
      this.rooms = rooms;
    };

    directions = [['l', '', 'r'], ['fl', 'f', 'fr'], ['ffll', 'ffl', 'ff', 'ffr', 'ffrr']];

    steps = function(direction, movement, start) {
      var arr, dir, dirs, moves, mv, pos, _i, _len;
      arr = start.split(':');
      pos = {
        x: parseInt(arr[0], 10),
        y: parseInt(arr[1], 10)
      };
      moves = {
        f: 'forward',
        l: 'left',
        r: 'right'
      };
      dirs = direction.split('');
      for (_i = 0, _len = dirs.length; _i < _len; _i++) {
        dir = dirs[_i];
        mv = movement[moves[dir]];
        if (mv.x != null) {
          pos.x += mv.x;
        }
        if (mv.y != null) {
          pos.y += mv.y;
        }
      }
      return this.rooms.getRoomAt(pos.x, pos.y);
    };

    ViewMatrix.calculate = function(player) {
      var movement, start;
      start = player.currentRoom;
      movement = player.movement;
      return [[steps(directions[0][0], movement, start), steps(directions[0][1], movement, start), steps(directions[0][2], movement, start)], [steps(directions[1][0], movement, start), steps(directions[1][1], movement, start), steps(directions[1][2], movement, start)], [steps(directions[2][0], movement, start), steps(directions[2][1], movement, start), steps(directions[2][2], movement, start), steps(directions[2][3], movement, start), steps(directions[2][4], movement, start)]];
    };

    return ViewMatrix;

  })();

  return View;

}).call(this);