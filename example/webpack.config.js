"use strict";

const path = require("path");

const webpack = require("webpack");
const HtmlPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlTagsPlugin = require("html-webpack-tags-plugin");

module.exports = (_env, args) => {
  const prod = args.mode === "production";
  return {
    context: __dirname,
    devServer: {
      hot: true,
      port: 3000,
      open: true,
    },
    devtool: !prod ? void 0 : "eval-source-map",
    entry: "./src",
    externals: {
      cesium: "Cesium",
    },
    mode: prod ? "production" : "development",
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: "babel-loader",
        },
      ],
    },
    output: {
      path: path.join(__dirname, "build"),
    },
    plugins: [
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify("/cesium"),
      }),
      new CopyPlugin({
        patterns: [
          {
            from: `../node_modules/cesium/Build/Cesium${prod ? "" : "Unminified"}`,
            to: "cesium",
          },
        ],
      }),
      new HtmlPlugin({
        template: "index.html",
      }),
      new HtmlTagsPlugin({
        append: false,
        tags: ["cesium/Widgets/widgets.css", "cesium/Cesium.js"],
      }),
      ...(prod ? [] : [new webpack.HotModuleReplacementPlugin()]),
    ],
    resolve: {
      alias: prod
        ? {}
        : {
            "react-dom": "@hot-loader/react-dom",
          },
    },
  };
};
