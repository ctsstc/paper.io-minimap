
var Util = class {

  static removePx(str) {
    return self.removeRight(str, 2);
  }

  static removeRight(str, i) {
    return str.substring(0, str.length - i);;
  }

}

String.prototype.removeRight = function (i) {
  return Util.removeRight(this, i);
}

String.prototype.removePX = function() {
  return Util.removePx(this);
}

String.prototype.addPx = function() {
  return this.addPx();
}

String.protoType

var MiniMapHax = class {

  constructor() {
    // Config
    this.scale = .1;
    this.x = 0;
    this.y = 0;
    this.bgColor = "#222";
    this.opacity = ".7";
    // Collect the goodness
    this.body = $("body");
    this.cursorsEl = $("#playcursors");
    this.cursors = this.initCursors();
    this.myCursorsEl = false; // set later
    this.gridEl = $("#grid");
    this.grid = this.initGrid();
    this.miniMapBg = false; // set later

    this.initMiniMap();
  }

  main() {
    this.drawMiniMap();
  }

  initCursors() {
    let cursors = this.cursorsEl.find("b").map((i, el) => {
      el = $(el);
      let name = el.data("playername");
      let x = el.css("left");
      let y = el.css("top");
      let color1 = el.css("background");
      let color2 = el.css("border-bottom");
      x = x.removePx();
      y = y.removePx();
      let cursorUi = $(`<div id="player-${name}" class="myCursor"></div>`);
      cursorUi.css({
        "background-color": color1
      });
      // Add to DOM
      this.body.append(cursorUi);

      return new Cursor(name, i, x, y, color1, color2, cursorUi, el);
    });

    // Cursor Styles
    this.myCursorsEl = $(".myCursor");
    let w = Cursor.width * this.scale;
    let h = Cursor.height * this.scale;
    this.myCursorsEl.css({
      "width": Cursor.width * this.scale.addPx(),
      "height": Cursor.height * this.scale.addPx()
    });

    return cursors;
  }

  initGrid() {
    let width = this.gridEl.css("width");
    let height = this.gridEl.css("height");
    let x = this.gridEl.css("left");
    let y = this.gridEl.css("top");
    width = width.removePx();
    height = height.removePx();
    x = x.removePx();
    y = y.removePx();
    return new Grid(width, height, x, y);
  }

  initMiniMap() {
    // Construct
    this.miniMapBg = $("<div id='miniMapHax'></div>");
    let w = this.grid.width * this.scale;
    let h = this.grid.height * this.scale;
    this.miniMapBg.css({
      "width": w.addPx(),
      "height": h.addPx(),
      "left": this.x.addPx(),
      "top": this.y.addPx(),
      "position": "fixed",
      "background-color": this.bgColor,
      "opacity": this.opacity
    });

    // Remove any old
    let last = $("#miniMapHax");
    if (last.length) {
      last.remove();
    }

    // Add to page
    this.body.append(this.miniMapBg);
  }

  drawMiniMap() {
    this.cursors.each((cur, i) => {
      cur.UIX = ;
    });
  }

}

var Cursor = class {

  constructor(name, i, x, y, color1, color2, elUi, liveEl) {
    this.name = name;
    this.i = i;
    this._x = x;
    this._y = y;
    this.color1 = color1;
    this.color2 = color2;
    this.elUi = elUi;
    this.liveEl = liveEl;
  }

  get xPx() {
    return this.liveEl.css("left");
  }

  get yPx() {
    return this.liveEl.css("top");
  }

  get x() {
    return this.xPx.removePx();
  }

  get y() {
    return this.yPx.removePx();
  }

  set UIX(x) {
    this.elUi.css("left") = x.addPx();
  }

  set UIY(y) {
    this.elUi.css("top") = y.addPx();
  }

}
// Static Game Vals  
Cursor.width = 30;
Cursor.height = 30;

var Grid = class {
  constructor(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
  }
}

// Todo, maybe try to switch over to mutation listeners
var myMiniMapHax = new MiniMapHax();
var myLoop = setInterval(() => { myMiniMapHax.main(); }, 200);

/**
 * var oldGameMove = game_move;
 * game_move = function(who,skip_animation){console.log("hooked"); return oldGameMove(who,skip_animation);}
 */