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
  var times = {};
  var status_dict = {}
  function timeit(f) {
    times[f.name] = [];
    return function() {
      var start = new Date().valueOf();
      var out = f.apply(this,arguments);
      var t = new Date().valueOf()-start;
      times[f.name].push(t);
      return out
    }
  }
  function rate(key) {
    per_second[key] = per_second[key] || [];
    per_second[key].push(new Date().valueOf());
  }
  function redraw() {
    if (!$('#debug_rates').length) { $('#tools_bot').append(container); }
    var now = new Date().valueOf();
    var html = '';
    var key;
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
    container.innerHTML = html;

    // now the statuses
    for (key in status_dict) {
      document.getElementById(key).innerHTML = status_dict[key];
    }
    requestAnimationFrame(redraw);
  }
  function rateFunc(func,key,context) {
    context = context || this;
    return function() {
      rate(key);
      func.apply(context,arguments);
    }
  }
  //redraw = rateFunc(redraw,'debug');
  redraw();
  return {
    log: function(msg) {
      PAINT.addMessage(msg);
    },
    rate: rate,
    rateFunc:rateFunc,
    status: status_dict
  }
})();
