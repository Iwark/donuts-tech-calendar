var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
  devtool: "source-map",
  entry: [
    __dirname + '/../app/assets/stylesheets/app.scss',
  ],
  output: {
    path: __dirname + '/../../assets/css/',
    filename: "app.css"
  },
  resolve: {
    extensions: ['', '.js', '.css']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel",
      query: {
        presets: ["es2015"]
      }
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract("style", "css")
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract("style", "css!sass")
    }]
  },
  plugins: [
    new ExtractTextPlugin("app.css")
  ]
};
