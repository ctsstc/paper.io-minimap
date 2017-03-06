
var Util = class {

  static removePx(str) {
    return this.removeRight(str, 2);
  }

  static removeRight(str, i) {
    return str.substring(0, str.length - i);;
  }

}

String.prototype.removeRight = function (i) {
  return Util.removeRight(this, i);
}

String.prototype.removePx = function() {
  return Util.removePx(this);
}

String.prototype.addPx = function() {
  return this + "px";
}

Number.prototype.addPx = function() {
  return this + "px";
}

var Config = {
  scale: .1,
  x: 10,
  y: 60,
  bgColor: "#222",
  opacity: ".7"
};

var MiniMapHax = class {

  constructor() {
    // Collect the goodness
    this.body = $("body");
    this.cursorsEl = $("#playcursors");
    this.myCursorsEl = false; // set later
    this.gridEl = $("#grid");
    this.grid = this.initGrid();
    this.miniMapBg = false; // set later

    this.initMiniMap();
    this.cursors = this.initCursors();
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
      let color1 = el.css("background-color");
      let color2 = el.css("border-bottom-color");
      x = x.removePx();
      y = y.removePx();
      let cursorUi = $(`<div id="player-${name}" class="myCursor"></div>`);
      cursorUi.css({
        "position": "absolute",
        "background-color": color1
      });
      // Add to DOM
      this.miniMapBg.append(cursorUi);

      return new Cursor(name, i, x, y, color1, color2, cursorUi, el);
    });

    // Cursor Styles
    this.myCursorsEl = $(".myCursor");
    let w = Cursor.width * Config.scale;
    let h = Cursor.height * Config.scale;
    this.myCursorsEl.css({
      "width": w > 0 ? (w).addPx() : 1,
      "height": h > 0 ? (h).addPx() : 1
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
    let w = this.grid.width * Config.scale;
    let h = this.grid.height * Config.scale;
    this.miniMapBg.css({
      "width": (w).addPx(),
      "height": (h).addPx(),
      "left": (Config.x).addPx(),
      "top": (Config.y).addPx(),
      "position": "fixed",
      "background-color": Config.bgColor,
      "opacity": Config.opacity
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
    this.cursors.each((i, cur) => {
      cur.updateUI();
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

  updateUI() {
    this.UIX = this.x * Config.scale;
    this.UIY = this.y * Config.scale;
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
    this.elUi.css("left", (x).addPx());
  }

  set UIY(y) {
    this.elUi.css("top", (y).addPx());
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