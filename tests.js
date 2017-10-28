var brush = {
  circle: [],
  circle2: [],
  mouth: [],
}

var u$ = {
  fg: "#tools_bot [name=fg]",
  bg: "#tools_bot [name=bg]",
  thickness: "#id_thickness",
  rect: "#tools [name=rect]",
  display: "canvas[name=display]",
  select_div: ".canvas .select",
  colors: "#tools_bot .color-picker",
}

for (var i = 0; i <2*Math.PI;i += 0.05) {
  brush.circle.push([50+20*Math.cos(i),50+20*Math.sin(i)]);
  brush.circle2.push([100+20*Math.cos(i),50+20*Math.sin(i)]);
  brush.mouth.push([75+100*Math.cos(i/4+Math.PI/4),50+100*Math.sin(i/4+Math.PI/4)]);
}

uC.Test.prototype.select = function (name) { return this.click("#tools [name="+name+"]"); }
uC.Test.prototype.clickCanvas = function (coords,opts) {
  for (var i=0;i<coords.length;i++) {
    coords[i][0] = coords[i][0]*PAINT.zoom - PAINT.current_image.scrollX;
    coords[i][1] = coords[i][1]*PAINT.zoom - PAINT.current_image.scrollY;
  }
  return this.mouseClick(u$.display,coords,opts);
}
uC.Test.prototype.clearImage = function() {
  // Eventually do this function should be replace with
  // this.test(testNew,{#id_width: 200, #id_height: 200})
  return this.wait(u$.rect).click()
    .changeValue(u$.fg,"#FFFFFF")
    .then(function resetZoom() {
      while (!document.querySelector('[name=zoom][data-level="1"]')) { document.querySelector("[name=zoom]").click() }
    })
    .changeValue(u$.bg,"#FFFFFF")
    .clickCanvas([[0,0],[200,200]])
    .changeValue(u$.fg,"#cb3594")
}

function testNew() {
  this.do("Testing new button",{
    "#id_width": 200,
    "#id_height": 200
  })
    .wait("tools [name=new-image]")
    .click()
    .wait("#alert-div ur-form")
    .changeForm()
    .checkResults("#alert-div ur-form")
    .click("#alert-div #submit_button")
    .checkResults(u$.display)
    .done("new button worked")
}

function testBasePage() {
  this.do("Testing that the HTML comes out the same after page is reset")
    .checkResults("#tools")
    .checkResults("#tools_bot")
    .done("Tools has not changed.")
}

function testBrush() {
  this.do("Testing brush")
    .clearImage()
    .select("brush")
    .clickCanvas(brush.mouth)
    .clickCanvas(brush.circle)
    .clickCanvas(brush.circle2)
    .checkResults(u$.display)
    .done()
}

function testFill() {
  var open_circle2 = brush.circle2.slice(0,brush.circle2.length-2);
  this.do()
    .clearImage()
    .select("fill")
    .clickCanvas([[0,0]])
    .changeValue(u$.fg,"#00FFFF")
    .select("brush")
    .clickCanvas(brush.circle)
    .clickCanvas(open_circle2)
    .clickCanvas(brush.mouth)
    .checkResults()
    .select("fill")
    .changeValue(u$.fg,"#FFFF00")
    .clickCanvas([[60,60]])
    .checkResults()
    .changeValue(u$.fg,"#FFFFFF")
    .clickCanvas([[110,60]])
    .checkResults()
    .done()
}

function testSelect() {
  this.do()
    .clearImage()
    //.test(testFill)
    .select("brush")
    .clickCanvas(brush.circle)
    .clickCanvas(brush.circle2)
    .clickCanvas(brush.mouth)
    .select("select")
    .clickCanvas([[50,50],[150,150]])
    .checkResults(u$.select_div)
    .mouseClick(u$.select_div,[[2,2],[-5,-5]])
    .mouseClick(u$.select_div,[[2,2],[-5,-5]])
    .mouseClick(u$.select_div,[[2,2],[-5,-5]])
    .mouseClick(u$.select_div,[[2,2],[-5,-5]])
    .checkResults(u$.select_div)
    .clickCanvas([[150,150]])
    .checkResults(u$.display)
    .done()
}

function testRect() {
  this.do()
    .clearImage()
    .select("rect")
    .changeValue(u$.thickness,0)
    .clickCanvas([[25,25],[75,75]])
    .changeValue(u$.thickness,2)
    .clickCanvas([[35,35],[85,85]])
    .changeValue(u$.thickness,4)
    .clickCanvas([[45,45],[95,95]])
    .changeValue(u$.thickness,8)
    .clickCanvas([[55,55],[105,105]])
    .changeValue(u$.thickness,16)
    .clickCanvas([[65,65],[115,115]])
    .done()
}

function testCircle() {
  this.do()
    .clearImage()
    .select("circle")
    .clickCanvas([[0,0],[200,200]])
    .changeValue(u$.fg,"#FFFF00")
    .clickCanvas([[51,36],[88,72]])
    .changeValue(u$.fg,"#FFFFFF")
    .clickCanvas([[111,3],[138,71]])
    .changeValue(u$.thickness,5)
    .changeValue(u$.bg,"#000000")
    .clickCanvas([[111,36],[138,71]])
    .changeValue(u$.thickness,0)
    .clickCanvas([[29,102],[170,152]],{button: 2})
    .changeValue(u$.fg,"#FF0000")
    .clickCanvas([[65,128],[127,173]])
    .done()
}

function testDropper() {
  this.do()
    .clearImage()
    .select("fill")
    .clickCanvas([[50,50]])
    .select("rect")
    .clickCanvas([[20,20],[80,80]], { button: 2 })
    .changeValue(u$.fg,"#000000")
    .changeValue(u$.bg,"#000000")
    .select("eye-dropper")
    .clickCanvas([[0,0]])
    .select("eye-dropper")
    .clickCanvas([[50,50]],{ button: 2 })
    .checkResults(u$.colors)
    .done()
}

konsole.addCommands(testNew, testBasePage, testBrush, testFill, testSelect, testRect, testCircle, testDropper)
