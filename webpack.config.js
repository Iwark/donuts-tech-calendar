var ExtractTextPlugin = require("extract-text-webpack-plugin");
var entryBasePath = __dirname + '/components/';
var outputBasePath = __dirname + '/public/';

module.exports = {
  devtool: "source-map",
  entry: {
    app: entryBasePath + 'app.js',
  },
  output: {
    path: outputBasePath,
    filename: "js/app.js"
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.css']
  },
  module: {
    loaders: [
      {
        test: /\.js|\.jsx$/,
        exclude: /node_modules/,
        loader: "babel",
        query: {
          presets: ["es2015", "react"]
        }
      },
      { 
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style", "css!sass")
      },
      { 
        test: /\.png$/,
        loader: "url-loader",
        query: { mimetype: "image/png" }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("css/[name].css")
  ]
};
