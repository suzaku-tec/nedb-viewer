const path = require("path");

module.exports = {
  entry: "./src/renderer.js",
  devtool: "source-map",
  target: "electron-renderer",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "renderer.js"
  }
};
