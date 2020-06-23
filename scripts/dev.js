const path = require('path')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const ENTRY = path.resolve(__dirname, '../resources/js/main.js')
const DIST = path.resolve(__dirname, '../public/dist/')

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
            presets: ['@babel/preset-react', '@babel/preset-env']
          }
        }
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: DIST,
    publicPath: '/dist/'
  },
}

const compiler = webpack(config)
const server = new WebpackDevServer(compiler, {
    contentBase: path.join(__dirname, '../public'),
    publicPath: '/dist/',
    hot: true,
    open: false,
    stats: true,
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
