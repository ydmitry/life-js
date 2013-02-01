/**
 * Класс для представления системы координат "вселенной"
 * Зависимости: jQuery
 * Интерфейс:
 * LifeGraphTable(element, width, height) - конструктор
 * point(x, y, s) - нарисовать точку
 */
var LifeGraphTable = function(element, width, height) {
  this.$el = $(element);
  this.width = width;
  this.height = height;
  this.coordinatesHash = {};
  this.init();
};

LifeGraphTable.prototype = {
  init: function() {
    var $table = $('<table class="life-graph-table"></table>').appendTo(this.$el);
    
    for (var i = 0; i <= this.height; i++) {
      var $tr = $('<tr></tr>');
      $tr.appendTo($table);
      for (var j = 0; j <= this.width; j++) {
        $td = $('<td></td>');
        $td.appendTo($tr);
        this.setCellEl(j, i, $td);
      }
    }
  },

  setCellEl: function(x, y, $el) {
    if (!this.coordinatesHash[x]) {
      this.coordinatesHash[x] = {};
    }

    this.coordinatesHash[x][y] = $el;
  },
  
  getCellEl: function(x, y) {
    return this.coordinatesHash[x][y];
  },

  point: function(x, y, s) {
    var $el = this.getCellEl(x, y);
    if (!s) {
      $el.removeClass('alive');
    } else {
      $el.addClass('alive');
    }
  }
};
