var d_data = {// testing dialog
  title: "yeah!",
  form: [
    {name: 'width', title: 'Width', value: 100, type: 'number'},
    {name: 'height', title: 'Height', value: 100, type: 'number'}
  ],
  accept: function() {alert("accepted")},
};
riot.mount("tools",{});
$(function() {
  PAINT.loadNewOrAutoSave();
})
