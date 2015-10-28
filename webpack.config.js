module.exports = {
    entry: './entry.js',
    output: {
      path: 'main/static/js/',
      filename: 'bundle.js',
      publicPath: 'bundle/',
      },
    resolve: {
      riot: require.resolve('./node_modules/riot/riot.js')
      },
    module: {
      loaders: [
            { test: /\.(tag)$/, loader: "tag" },
            { test: /\.(woff|ttf|svg|eot|jpg)$/, loader: "file" },
            { test: /\.css$/, loader: "style!css" },
            { test: /\.coffee$/, loader: "coffee-loader" },
            { test: /\.js$/, loader: 'babel-loader' }
            ]
      }
}
