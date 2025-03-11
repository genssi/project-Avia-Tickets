const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const precss = require("precss");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    polyfill: "babel-polyfill",
    app: "./js/app.js",
  },
  context: path.resolve(__dirname, "src"),
  module: {
    rules: [
      { test: /\.svg$/, use: "svg-inline-loader" },
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: "css-loader",
            options: { importLoaders: 1, sourceMap: true },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [precss, autoprefixer],
              },
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env"] },
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[hash].js",
    publicPath: "/project-Avia-Tickets/",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "./style.css",
    }),
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
  ],
  mode: "production",
};
