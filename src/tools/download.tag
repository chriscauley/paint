PAINT.Download = class Download extends PAINT.DialogTool {
  constructor() {
    super({name: 'download', title: 'Download Image', icon: 'download'});
    this.tagName = "download-image";
  }
  getOpts() {
    return {
      title: "Download Image",
      src: PAINT.current_image.canvas.toDataURL(),
      hide_cancel: true
    }
  }
}

<download-image>
  <div class={ theme.outer } title="Download mofo" src={ opts.src }>
    <div class={ theme.header }>{ title }</div>
      <div class="download-image { theme.content }">
      <a href={ opts.src } download="img.png" class="download"><img src="{ opts.src }" /></a>
      <div>Right click the above image and...</div>
      <li>To save to disc, select "Save Image As..."</li>
      <li>To embed in a website, select "Copy Image URL"</li>
    </div>
  </div>

  <style>
    .download img { max-height: 500px; }
  </style>
</download-image>
