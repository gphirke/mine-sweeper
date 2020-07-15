const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, 'src/index'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      include: path.resolve(__dirname, 'src'),
      loader: 'babel-loader',
      options: {
        plugins: [
          '@babel/plugin-proposal-class-properties'
        ],
        presets: [
          "@babel/preset-react",
          "@babel/preset-env"
        ]
      }
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }]
  },
  devServer: {
    contentBase:  path.resolve(__dirname, 'dist'),
    port: 9000
  },
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html" //source html
    })
  ]
};
