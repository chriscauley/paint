PAINT.SelectTool = class SelectTool extends PAINT.Tool {
  constructor() {
    // this tool needs a canvas to store the selected image fragment
    super({name: 'select', title: 'Select', className: 'select-button'})
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.bounding = true;
    document.addEventListener("cut",this.cut.bind(this));
  }
  selectAll() {
    this.down({button:0});
    this.up(); //release mouse
    this.action.left = this.action.top = 0;
    this.action.w = PAINT.current_image.WIDTH;
    this.action.h = PAINT.current_image.HEIGHT;
    this.redraw();
  }
  select() {
    this.div = document.querySelector(".canvas-wrapper .select");
  }
  down(e) {
    // reset the selection div
    this.div.style.backgroundImage = "";
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
    this.move(e);
    this.drawn = false;
  }
  move(e) {
    // this sizes the selection window, but hasn't actually selected anything
    // action.top/left : top left corner of select relative to image canvas
    // this action.x1/y1 mouse down when drawing select
    // this.action.x2/y2 mouse up when drawing select
    this.action.left = (this.action.w>0)?this.action.x1:this.action.x2;
    this.action.top = (this.action.h>0)?this.action.y1:this.action.y2;
    this.redraw();
    return true; // stops selectMove from executing
  }
  redraw() {
    // calculate the position and size of the select, this funciton is global for scroll/zoom
    var i = PAINT.current_image;
    var a = this.action;
    if (!a) { return }
    this.div.style.display = (a.x1 == a.x2 && a.y1 == a.y2)?"none":"block";
    this.div.style.width = Math.abs(PAINT.zoom*a.w)+"px";
    this.div.style.height = Math.abs(PAINT.zoom*a.h)+"px";
    this.div.style.top = PAINT.zoom*a.top-i.scrollY+"px";
    this.div.style.left = PAINT.zoom*a.left-i.scrollX+"px";
  }
  selectDraw() {
    // only once per selection
    if (this.drawn) { return }
    this.drawn = true;

    //save the selected piece of canvas and use it as background for this.div
    var i = PAINT.current_image;
    [this.canvas.width,this.canvas.height] = [this.action.w,this.action.h]
    this.context.drawImage(i.canvas,
                           this.action.left,this.action.top,this.action.w,this.action.h,
                           0,0,this.action.w,this.action.h)
    this.dataURL = this.canvas.toDataURL();
    this.div.style.backgroundImage = "url("+this.dataURL+")";
    [this.action.top0, this.action.left0] = [this.action.top, this.action.left]
  }
  selectCut() {
    //fill in the background color where the select window was
    var context = this.action.context;
    var image = PAINT.current_image;
    context.clearRect(0,0,image.WIDTH,image.HEIGHT);
    context.fillStyle = this.action.color2;
    context.beginPath();
    context.rect(this.action.left0,this.action.top0,Math.abs(this.action.w),Math.abs(this.action.h));
    context.fill();
    context.closePath();
    //this.autocrop();
  }
  autocrop() {
    var context = this.action.context;
    var data = context.createImageData(this.action.w,this.action.h).data;
    // there's no such thing as data.slice :(
    console.log(data)
    var tl = data.slice(0,4);
    var tr = data.slice(this.action.w*4,this.action.w*4+4);
    var bl = data.slice(data.length - this.action.w*4,data.length - this.action.w*4 + 4);
    var br = data.slice(data.length - 4);
    if (tl == tr) {console.log('top')}
    if (tl == bl) {console.log('left')}
    if (tr == br) {console.log('right')}
    if (bl == br) {console.log('bottom')}
  }
  selectDown(e) {
    this.select_down = true;
    [this.action.x_start,this.action.y_start] = PAINT.getMouseXY(e);
    this.selectDraw();
    this.selectCut();
    PAINT.current_image.redraw();
  }
  selectMove(e) {
    // find the difference between the moves relative to the div position. create a temporary position
    // this.action.x_start/y_start mouse click to start moving select re:this.div
    // this.action.x_end/y_end mouse click where mouse currently is re:this.div
    // this.action.top2/left2  current, temporary position of div re:image.canvas
    if (this.move(e)) { return; }
    if (!this.select_down) { return; }
    var i = PAINT.current_image;
    [this.action.x_end,this.action.y_end] = PAINT.getMouseXY(e);
    this.action.top2 = this.action.top - (this.action.y_start - this.action.y_end);
    this.action.left2 = this.action.left - (this.action.x_start - this.action.x_end);
    this.div.style.top = PAINT.zoom*this.action.top2-i.scrollY+"px";
    this.div.style.left = PAINT.zoom*this.action.left2-i.scrollX+"px";
  }
  selectUp(e) {
    // mouse released, set the div position to the temporary position
    this.up(e);
    this.selectMove(e);
    if (this.select_down) { [this.action.left,this.action.top] = [this.action.left2,this.action.top2]; }
    this.select_down = false;
    this.selectCut();
    this.action.context.drawImage(this.canvas,this.action.left,this.action.top);
    PAINT.current_image.redraw();
    PAINT.storage.autoSave();
  }
  cut(e) {
    console.log("cut")
  }
  copy(e) {
    
  }
  paste(e) {
    
  }
  options(e) {
    return [
      { name: 'cut', icon: 'cut', click: this.cut, is_button: true },
      { name: 'copy',  icon: 'copy', click: this.copy, is_button: true },
      { name: 'paste',  icon: 'paste', click: this.paste, is_button: true },
    ]
  }
}
