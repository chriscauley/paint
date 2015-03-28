Paint by Chris Cauley
========

A recent project I started working on needs a canvas drawing program. Hopefully it will be made into a full fledged pluggable app that can work with many projects. More on this coming soon.

Adapted from this tutorial:

http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/

Model Structure
--------

Bitmap Images are stored as json objects in the database define thusly:

```
BitmapImage = {
  name: String,
  actions: [CanvasAction1,CanvasAction2,...],
  dataURL: "data:image/png;base64,...", // Image data in final state from canvas
}
```

Actions can vary greatly depending on the tool used, but in general match the following format:

```
CanvasAction = {
  tool: "(brush|fill|select|rect|circle|resize|...)", // which tool is being used
  x: Number, // Starting x position
  y: Number,
  w: Number, // width
  h: Number, // height
  click_x: Number, // Position in x where mouse was clicked
  click_y: Number,
  move_x: Number, // Distance in pixels x was moved
  move_y: Number,
  coords: [[x1,y1],[x2,y2]...], // corridinates for paint brush
  color1: String,
  color2: String,
  dataURL: "data:image/png;base64,...", // Image data for a given action
  destroy: function() {}, // callback executed when action is finished, destroy is removed on its execution
}
```

* tool: The tool_name for an action which is used to route events to various callbacks. This is preferable to adding and removing actual event listeners.

* *x, y, width, height, click_x, click_y, move_x, move_y*: Various ways to store coordinates of events. Most of these are only used for the select box which requires all of them. Other actions like fill, rect, and circle will only use one or two pairs of coordinates.

* 
