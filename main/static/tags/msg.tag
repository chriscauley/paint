<msg>
  <div>{ text }</div>

  this.text = opts.text
  this.timeout = setTimeout(function(){
    this.root.style.marginTop = "-50px"
    setTimeout(function(){this.unmount()},5000)
  },5000)
</msg>
