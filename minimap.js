
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

String.prototype.removePx = function () {
  return Util.removePx(this);
}

String.prototype.addPx = function () {
  return this + "px";
}

Number.prototype.addPx = function () {
  return this + "px";
}

var Config = {
  scale: .1,
  x: 10,
  y: 60,
  bgColor: "#222",
  opacity: ".7",
  zIndex: 2,
  gridSize: 30 // game grid size
};

var MiniMapHax = class {

  constructor() {
    // Collect the goodness
    this.body = $("body");
    this.cursorsEl = $("#playcursors");
    this.myCursorsEl = false; // set later
    this.gridEl = $("#grid");
    this.miniMapContainer = $("<div id='miniMapHax'></div>"); // set later
    this.grid = this.initGrid();

    this.initMiniMap();
    this.cursors = this.initCursors();
  }

  main() {
    this.drawMiniMap();
    this.grid.updateUI();
  }

  initCursors() {

    let cursorContainer = $("<div id='myCursors'></div>");

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

      // Add to cursor container
      cursorContainer.append(cursorUi);

      return new Cursor(name, i, x, y, color1, color2, cursorUi, el);
    });

    // Add cursors to DOM
    this.miniMapContainer.append(cursorContainer);

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
    return new Grid(width, height, x, y, this.miniMapContainer);
  }

  initMiniMap() {
    // Construct
    let w = this.grid.width * Config.scale;
    let h = this.grid.height * Config.scale;
    this.miniMapContainer.css({
      "width": (w).addPx(),
      "height": (h).addPx(),
      "left": (Config.x).addPx(),
      "top": (Config.y).addPx(),
      "position": "fixed",
      "background-color": Config.bgColor,
      "opacity": Config.opacity,
      "z-index": Config.zIndex
    });

    // Remove any old
    let last = $("#miniMapHax");
    if (last.length) {
      last.remove();
    }

    // Add to page
    this.body.append(this.miniMapContainer);
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
  constructor(width, height, x, y, containerUi) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.containerUI = containerUi;
    this.playgroundEl = $("#playground");
    this.playgroundContainer = $("<div id='myPlayground'></div>");

    this.addUI();
  }

  addUI() {
    this.containerUI.append(this.playgroundContainer);
  }

  get playground() {
    let playground = this.playgroundByPlayer;
    return Object.keys(playground).reduce((pre, cur) => {
      return pre.concat(playground[cur]);
    }, []);
  }

  get playgroundByPlayer() {
    // Todo cache until an update is required
    return this.playgroundEl.find("b").get().reduce((pre, cur) => {
      cur = $(cur);
      let name = cur.attr("class").removeRight(6); // remove "_owned"
      let x = cur.css("left").removePx() / Config.gridSize;
      let y = cur.css("top").removePx() / Config.gridSize;
      let h = cur.css("height").removePx() / Config.gridSize;
      /**
       * Could be implemented higher up to reduce redundancy, 
       * but doesn't work too well with the other playground reduce
       * ie: player: { color, playground/zone }
       */
      let color = cur.css("background-color");

      // add key if not exists
      if (!pre.hasOwnProperty(name))
        pre[name] = [];

      // add data to key
      pre[name].push({
        x: x,
        y: y,
        h: h,
        color: color
      });

      return pre;

    }, {});
  }

  updateUI() {

    // out with the old
    this.containerUI.find(".zone").remove();

    // in with the new
    this.playground.forEach((e, i) => {

      let zone = $("<div class='zone'></div>");
      let x = e.x * Config.gridSize * Config.scale;
      let y = e.y * Config.gridSize * Config.scale;
      let w = Config.gridSize * Config.scale;
      let h = e.h * Config.gridSize * Config.scale;

      zone.css({
        "background-color": e.color,
        "left": x.addPx(),
        "top": y.addPx(),
        "width": w.addPx(),
        "height": h.addPx(),
        "position": "absolute"
      });

      this.playgroundContainer.append(zone);
    });

  }

}

// Todo, maybe try to switch over to mutation listeners
var myMiniMapHax = new MiniMapHax();
var myLoop = setInterval(() => { myMiniMapHax.main(); }, 200);

/**
 * var oldGameMove = game_move;
 * game_move = function(who,skip_animation){console.log("hooked"); return oldGameMove(who,skip_animation);}
 */