<dialog>
  <div class="mask" onclick={ cancel }></div>
  <div class="content">
    <div class="title-bar border-box">{ title }</div>
    <div class="pure-form pure-form-aligned" if={ form }>
      <div class="pure-control-group" each={ forms }>
        <label>{ title }</label>
        <input name="{ name }" type="{ type }" id="id_{ name }" can-value="value">
      </div>
    </div>
    <div class="buttons border-box">
      <button class="pure-button button-error" onclick={ cancel }>Cancel</button>
      <button class="pure-button button-success" onclick={ accept }>Okay</button>
    </div>
  </div>
  cancel(e) {
    this.unmount()
  }
  accept(e) {
    this.accept()
  }
</dialog>
