var brush = {
  circle: [],
  circle2: [],
  mouth: [],
}
for (var i = 0; i <2*Math.PI;i += 0.05) {
  brush.circle.push([50+20*Math.cos(i),50+20*Math.sin(i)]);
  brush.circle2.push([100+20*Math.cos(i),50+20*Math.sin(i)]);
  brush.mouth.push([75+100*Math.cos(i/4+Math.PI/4),50+100*Math.sin(i/4+Math.PI/4)]);
}

uC.Test.prototype.select = function (name) { return this.click("#tools [name="+name+"]"); }
uC.Test.prototype.clickCanvas = function (coords) { return this.mouseClick("canvas[name=display]",coords); }
uC.Test.prototype.clearImage = function() {
  var neio = "neoi"
  // Eventually do this function should be replace with
  // this.test(testNew,{#id_width: 200, #id_height: 200})
  return this.wait("#tools [name=rect]").click()
    .changeValue("#tools_bot [name=fg]","#FFFFFF")
    .clickCanvas([[0,0],[200,200]])
    .changeValue("#tools_bot [name=fg]","#cb3594")
}

function testNew() {
  this.do("Testing new button",{
    "#id_width": 200,
    "#id_height": 200
  })
    .wait("tools [name=new]")
    .click()
    .wait("#alert-div ur-form").checkResults()
    .checkResults("canvas[name=display]")
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
    .checkResults("canvas[name=display]")
    .done()
}

function testFill() {
  var open_circle2 = brush.circle2.slice(0,brush.circle2.length-2);
  this.do()
    .clearImage()
    .select("fill")
    .clickCanvas([[0,0]])
    .changeValue("#tools_bot [name=fg]","#00FFFF")
    .select("brush")
    .clickCanvas(brush.circle)
    .clickCanvas(open_circle2)
    .clickCanvas(brush.mouth)
    .checkResults()
    .select("fill")
    .changeValue("#tools_bot [name=fg]","#FFFF00")
    .clickCanvas([[60,60]])
    .checkResults()
    .changeValue("#tools_bot [name=fg]","#FFFFFF")
    .clickCanvas([[110,60]])
    .checkResults()
    .done()
}

function testSelect() {
  var arst = 0;
  this.do()
    .clearImage()
    //.test(testFill)
    .select("brush")
    .clickCanvas(brush.circle)
    .clickCanvas(brush.circle2)
    .clickCanvas(brush.mouth)
    .select("select")
    .clickCanvas([[50,50],[150,150]])
    .checkResults(".canvas .select")
    .mouseClick(".canvas .select",[[2,2],[-5,-5]])
    .checkResults(".canvas .select")
    .clickCanvas([[150,150]])
    .checkResults("canvas[name=display]")
    .done()
}

konsole.addCommands(testNew, testBasePage, testBrush, testFill, testSelect)
