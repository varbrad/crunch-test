const path = require('path')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const ENTRY = path.resolve(__dirname, '../resources/js/main.js')
const DIST = path.join(__dirname, '../public/dist')

const config = {
  mode: 'development',
  entry: ENTRY,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
            plugins: ['react-refresh/babel'],
          }
        }
      }
    ]
  },
  plugins: [
      new ReactRefreshWebpackPlugin(),
  ],
  output: {
    filename: '[name].js',
    path: DIST,
    publicPath: 'http://localhost:8080/dist/',
  },
}

const compiler = webpack(config)
const server = new WebpackDevServer(compiler, {
    contentBase: path.join(__dirname, '../public'),
    publicPath: 'http://localhost:8080/dist/',
    hotOnly: true,
    open: false,
    stats: false,
    port: 8080,
    disableHostCheck: true,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
})

server.listen(8080, '127.0.0.1', () => {
    console.log('Starting server on http://localhost:8080');
});
