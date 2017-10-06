function testNew() {
  this.do("Testing new button")
    .wait("tools [name=new]")
    .click()
    .checkResults("canvas[name=display]")
    .done("new button worked")
}

function testBasePage() {
  this.do("Testing that the HTML comes out the same after page is reset")
    .checkResults("#tools")
    .checkResults("#tools_bot")
    .done("Tools has not changed.")
}

konsole.addCommands(testNew,testBasePage)
