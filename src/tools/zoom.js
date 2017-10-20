PAINT.ZoomTool = class ZoomTool extends PAINT.Tool {
  constructor() {
    super({name: 'zoom', title: 'Change Zoom', icon: 'search-plus'})
    this.zooms = [1,2,3,4,5];
  }
  select(e) {
    var i = this.zooms.indexOf(PAINT.zoom)+1;
    if (i == this.zooms.length) { i = 0 }
    PAINT.changeTool(PAINT.last_tool,true);
    PAINT.updateZoom(this.zooms[i]);
  }
}
