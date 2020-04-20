require('dotenv').config()

const withSass = require("@zeit/next-sass");
const withCss = require("@zeit/next-css");
const withPlugins = require("next-compose-plugins");

const DotEnv = require('dotenv-webpack');
const server = require('./server.js')

module.exports = withPlugins([
  [
    {
      webpack: function(config) {
        config.devtool = 'cheap-module-source-map';
        config.node = {
          fs: 'empty',
          child_process: 'empty',
          module: 'empty'
        };
        config.module.rules.push({
          test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
          use: {
            loader: "url-loader",
            options: {
              limit: 100000,
              name: "[name].[ext]",
            },
          }
        });

        config.plugins = config.plugins || []
        config.plugins = [
          ...config.plugins,
          new DotEnv({
            path: server.config,
            systemvars: true,
            silent: true
          })
        ];

        return config
      },
    }
  ]
])