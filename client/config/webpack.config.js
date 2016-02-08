var ExtractTextPlugin = require("extract-text-webpack-plugin");
var entryBasePath = __dirname + '/../app/assets/';
var outputBasePath = __dirname + '/../../assets/';

module.exports = {
  devtool: "source-map",
  entry: {
    js : entryBasePath + 'javascripts/app.js',
    app : entryBasePath + 'stylesheets/app.scss',
  },
  output: {
    path: outputBasePath,
    filename: "js/app.js"
  },
  resolve: {
    extensions: ['', '.js', '.css']
  },
  module: {
    loaders: [
      { 
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style", "css!sass")
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin("css/[name].css")
  ]
};
