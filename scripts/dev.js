const fs = require('fs-extra')
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
    .option('-e, --entry <entry>', 'The entry-point of the app', '/resources/js/main.js')
const args = program.parse(process.argv)

const PATH = args.path
const PORT = args.port

const ENTRY = path.join(__dirname, '..', args.entry)

if (!fs.existsSync(ENTRY)) {
    console.log('Entrypoint not found?', ENTRY)
    process.exit(1)
}

const CONTENT_BASE = path.join(__dirname, '../public')
const PUBLIC_PATH = `http://localhost:${PORT}${PATH}`

console.log(args.entry)

const BABEL_LOADER = {
    loader: 'babel-loader',
    options: {
        presets: ['@babel/preset-react', '@babel/preset-env'],
        plugins: ['react-refresh/babel'],
    }
}

const config = {
  mode: 'development',
  entry: ENTRY,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: BABEL_LOADER,
      },
      {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [BABEL_LOADER, 'ts-loader']
      }
    ]
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
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
    port: PORT,
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
        const message = errors.map(error => error.message).join('\n')
        log.fail('An error occured!\n\n' + message)
    } else {
        log.succeed('Built!')
    }
    log.stopAndPersist({ symbol: '👀', text: 'Watching for changes...' })
})

server.listen(PORT, '127.0.0.1', () => {
    log.succeed(`Dev server is up! - ${chalk.yellow(PUBLIC_PATH)}`)
});
