process.env.NODE_ENV = 'production';

const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('./config.js');
const webpackConfigFn = require('./webpack.prod.conf');

const spinner = ora('building for production...');
spinner.start();

rm(path.join(config.build.assetsRoot, 'index.*'), err => {
  if (err) throw err;

  rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    if (err) throw err;
    // commonjs2
    config.build.filename = '[name].min.js';
    config.build.libraryTarget = 'commonjs2';
    webpack(webpackConfigFn(config), function (err) {
      if (err) throw err;
      // umd
      config.build.filename = '[name]-umd.min.js';
      config.build.library = 'socketio';
      config.build.libraryTarget = 'umd';
      webpack(webpackConfigFn(config), function (err, stats) {
        spinner.stop();
        if (err) throw err;
        process.stdout.write(
          stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false,
          }) + '\n\n'
        );

        console.log(chalk.cyan('  Build complete.\n'));
        console.log(
          chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
              "  Opening index.html over file:// won't work.\n"
          )
        );
      });
    });
  });
});
