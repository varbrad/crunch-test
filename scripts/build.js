const fs = require('fs-extra')
const path = require('path')
const webpack = require('webpack')

const ENTRY = path.resolve(__dirname, '../resources/js/main.js')
const DIST = path.resolve(__dirname, '../public/dist/')

const config = {
  mode: 'production',
  entry: ENTRY,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
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

webpack(config, err => {
    if (err) console.warn(err)
    console.log('Done!')
})
