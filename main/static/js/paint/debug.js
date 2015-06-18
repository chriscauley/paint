window.PAINT = window.PAINT || {}

PAINT.debug = (function() {
  /* return {
     log: function() {},
     count: function() {},
     rate: function() {}
  */
  var container = document.createElement('div');
  container.id = 'debug_rates';
  var counts = {};
  var per_second = {};
  function rate(key) {
    per_second[key] = per_second[key] || [];
    per_second[key].push(new Date().valueOf());
  }
  function redraw() {
    if (!$('#debug_rates').length) { $('#tools_bot').append(container); }
    var now = new Date().valueOf();
    var html = '';
    for (key in counts) {
      html += "<div><b>"+key+":</b> "+counts[key]+"</div>";
    }
    for (key in per_second) {
      var count = 0;
      var time = per_second[key][per_second[key].length-1];
      for (var i=0;i<per_second[key].length; i++) {
        if (per_second[key][i] > (time-1000)) { count ++ }
      }
      html += "<div><b>"+key+"</b> "+per_second[key].length+" ("+count+"/s)</div>";
    }
    container.innerHTML = html
  }
  function rateFunc(func,key,context) {
    context = context || this;
    return function() {
      rate(key);
      func.apply(context,arguments);
    }
  }
  //redraw = rateFunc(redraw,'debug');
  $(function() {
    setInterval(redraw,20);
  });
  return {
    log: function(msg) {
      PAINT.addMessage(msg);
    },
    rate: rate,
    rateFunc:rateFunc,
  }
})();
