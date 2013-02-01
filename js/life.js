/**
 * Алгоритм игры "жизнь"
 * Зависимости: jQuery 
 * Опции:
 *
 *  height - высота
 *  width - ширина
 *  firstGeneration - массив первого поколения [[x1, y1], [x2, y2], ..., [xN, yN]]
 *  el - селектор элемента
 * 
 *  GraphClass - класс отображения графики с интерфейсом
 *    GraphClass(element, width, height)
 *    point(x, y, s)
 */
var Life = function(options) {
  this.options = options;
  this.width = options.width;
  this.height = options.height;
  this.coordinatesHash = {};
  this.graph = new options.GraphClass(this.options.el, this.width, this.height);

  for (var p in options.firstGeneration) {
    this.point(options.firstGeneration[p][0], options.firstGeneration[p][1], 1);
  }
  
  setInterval($.proxy(this.nextStep, this), 1000);
};

Life.prototype = {
  nextStep: function() {
    var coordinates = this.getAllCoordinates();
    var newCoordinatesHash = {};
    for (var p in coordinates) {
      var x = parseInt(coordinates[p].x);
      var y = parseInt(coordinates[p].y);

      if (!newCoordinatesHash[x]) {
        newCoordinatesHash[x] = {};
      }

      if (!newCoordinatesHash[x-1]) {
        newCoordinatesHash[x-1] = {};
      }

      if (!newCoordinatesHash[x+1]) {
        newCoordinatesHash[x+1] = {};
      }

      newCoordinatesHash[x][y] = this.getNewState(x, y, this.getState(x, y));
      
      var nearestCoordinates = this.getNearestCoordinates(x, y);
      for (var coordinate in nearestCoordinates) {
        var u = nearestCoordinates[coordinate][0];
        var v = nearestCoordinates[coordinate][1];
        if (this.isAccessible(u, v)) {
          newCoordinatesHash[u][v] = this.getNewState(u, v, this.getState(u, v));
        }
      }
    }

    this.reset(newCoordinatesHash)
  },

  reset: function(coordinatesHash) {
    var coordinates = this.getAllCoordinates();    
    for (var p in coordinates) {
      this.point(coordinates[p].x, coordinates[p].y, 0);
    }
    
    for (var x in coordinatesHash) {
      for (var y in coordinatesHash[x]) {
        this.point(x, y, coordinatesHash[x][y]);
      }
    }
  },

  point: function(x, y, s) {

    x = parseInt(x);
    y = parseInt(y);
    s = parseInt(s);
    
    this.setState(x, y, s);
    this.graph.point(x, y, s);
  },

  getAllCoordinates: function() {
    var a = [];

    for (var x in this.coordinatesHash) {
      for (var y in this.coordinatesHash[x]) {
        a.push({
          x: x,
          y: y
        });
      }
    }
    return a;
  },

  getNearestCoordinates: function(x,y) {
    return [
      [x-1, y-1], [x-1, y], [x-1, y+1], [x, y-1],
      [x, y+1], [x+1, y-1], [x+1, y], [x+1, y+1]
    ];
  },

  isAccessible: function(x, y) {
    x = parseInt(x);
    y = parseInt(y);

    if (x >= 0 && x < this.width && y >=0 && y < this.height) {
      return true;
    } else {
      return false;
    }
  },
  
  getNewState: function(x, y, s) {
    var k = 0;

    x = parseInt(x);
    y = parseInt(y);
    s = parseInt(s);

    var nearestCoordinates = this.getNearestCoordinates(x, y);
    for (var coordinate in nearestCoordinates) {
      var u = nearestCoordinates[coordinate][0];
      var v = nearestCoordinates[coordinate][1];
      if (this.isAccessible(u, v) && this.getState(u, v)) {
        k = k + 1;
      }
    }


    if (
        (k == 2 || k == 3) && s == 1
      || k == 3 && s == 0
    ) {
      return 1;
    } else {
      return 0;
    }
  },

  getState: function(x, y) {
    if (!this.coordinatesHash[x]) {
      return 0;
    }
    
    if (!this.coordinatesHash[x][y]) {
      return 0;
    }

    return this.coordinatesHash[x][y];
  },

  setState: function(x, y, s) {
    if (!this.coordinatesHash[x]) {
      this.coordinatesHash[x] = {};
    }

    if (!s) {
      delete this.coordinatesHash[x][y];
    } else {
      this.coordinatesHash[x][y] = s;
    }
  }
};
