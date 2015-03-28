var image = {
  h: 100,
  w: 100
}
var tools_data = new can.Map({
  left_tools: new can.List([
    [{name: 'new', title: 'New Image', icon: 'file-o', className: ''},
     {name: 'open', title: 'Open Image', icon: 'folder-open-o', className: ''},
     {name: 'upload', title: 'Upload Image', icon: 'upload', className: ''},
     {name: 'save', title: 'Save Image', icon: 'floppy-o', className: ''},
     {name: 'saveAs', title: 'Save Image As', icon: 'floppy-o', className: 'save-as-new'},
    ],
    [{name: 'brush', title: 'brush', icon: 'paint-brush', className: ''},
     {name: 'fill', title: 'fill', icon: '', className: 'fill-button'},
     {name: 'select', title: 'select', icon: '', className: 'select-button'},
     {name: 'rect', title: 'rectangle', icon: '', className: 'rect-button'},
     {name: 'circle', title: 'circle', icon: '', className: 'circle-button'},
     {name: 'resize', title: 'resize', icon: 'arrows', className: ''},
     {name: 'eye_dropper', title: 'select color', icon: 'eyedropper', className: ''},
    ]
  ]),
  colors: {
    fg: "#cb3594",
    bg: "#ffffff",
  },
});
can.Component.extend({
  tag: 'winder',
  template: can.view("mustache/dialog.html"),
});
var template = can.view("mustache/app.html", tools_data);
$("#app").html(template);
var d_data = new can.Map({
  title: "yeah!",
  form: [
    {name: 'width', title: 'Width', value: image.w, type: 'number'},
    {name: 'height', title: 'Height', value: image.h, type: 'number'}
  ],
  accept: function() {
    $("winder").remove();
  },
  cancel: function() {
    $("winder").remove();
  }
});
//var dlog = can.mustache("<winder></winder>")
//$("body").append(dlog(d_data));
function buttonClick() { changeTool(this.name); }
function changeTool(name) {
  $("#tools .active").removeClass("active")
  $("[name="+name+"]").addClass("active");
}
$("#tools button").click(buttonClick);

var PaintImage = can.Model.LocalStorage.extend({}, {});
