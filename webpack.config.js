const path = require("path");

// plugins
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
const NodemonPlugin = require("nodemon-webpack-plugin");

module.exports = {
  target: "node",
  mode: process.env.NODE_ENV,
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: path.resolve(__dirname, "node_modules"),
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx"],
  },
  plugins: [
    new Dotenv(),
    new NodemonPlugin(),
    new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ }),
  ],
};
