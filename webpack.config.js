var LessPluginCleanCSS = require('less-plugin-clean-css');
module.exports = {
  entry: './entry.js',
  output: {
    path: 'bundle/',
    filename: 'bundle.js',
    publicPath: 'bundle/',
  },
  resolve: {
    riot: require.resolve('./node_modules/riot/riot.js')
  },
  module: {
    loaders: [
      { test: /\.(tag)$/, loader: "tag" },
      { test: /\.(png|woff|ttf|svg|eot|jpg)$/, loader: "file" },
      { test: /\.css$/, loader: "style!css" },
      { test: /\.coffee$/, loader: "coffee-loader" },
      { test: /\.js$/, loader: 'babel-loader' },
      { test: /\.less$/, loader: "style!css?minimize!less?config=lessLoaderCustom" }
    ]
  },
  lessLoader: {
    lessPlugins: [
      new LessPluginCleanCSS({advanced: true})
    ]
  }
}
