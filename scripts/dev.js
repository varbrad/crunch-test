const program = require('commander')
const path = require('path')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const ora = require('ora')
const chalk = require('chalk')

program
    .option('-p, --port <port>', 'The port to run the bundle server on', 8080)
    .option('--path <path>', 'The path to build to', '/dist/')
const args = program.parse(process.argv)

const PATH = args.path
const PORT = args.port

const ENTRY = path.resolve(__dirname, '../resources/js/main.js')
const DIST = path.join(__dirname, '../public', PATH)

const CONTENT_BASE = path.join(__dirname, '../public')
const PUBLIC_PATH = `http://localhost:${PORT}${PATH}`

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
    path: PATH,
    publicPath: PUBLIC_PATH,
  },
}

const log = ora({ prefixText: chalk.cyan('Crunch'), text: 'Preparing to launch server...', spinner: 'bouncingBar' }).start()

const compiler = webpack(config)

const server = new WebpackDevServer(compiler, {
    contentBase: CONTENT_BASE,
    publicPath: PUBLIC_PATH,
    hotOnly: true,
    open: false,
    stats: false,
    noInfo: true,
    disableHostCheck: true,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
})


compiler.hooks.beforeCompile.tap('Crunch', () => {
    log.start('Crunching...')
})

compiler.hooks.afterCompile.tap('Crunch', (compilation) => {
    const { errors } = compilation
    if (errors && errors.length > 0) {
        log.fail('An error occured!\n' + JSON.stringify(errors, null, 2))
    } else {
        log.succeed('Built!')
    }
    log.stopAndPersist({ symbol: '👀', text: 'Watching for changes...' })
})

server.listen(PORT, '127.0.0.1', () => {
    log.succeed(`Dev server is up! - ${chalk.yellow(PUBLIC_PATH)}`)
});
