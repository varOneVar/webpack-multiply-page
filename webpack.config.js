'use strick';
const htmlplugins = require('./webpack.settings')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const glob = require('glob')
const path = require('path')
function resolve(pathStr) {
  return path.join(__dirname, pathStr)
}

const files = glob.sync("./src/entry/*.js")
console.log(files, 'files')
const entry = files.reduce((t, c) => {
  const filename = c.replace(/.+\/(\w+)\.js$/, '$1')
  t[filename] = c
  return t
}, {})
console.log(entry, 'files')
module.exports = {
  entry,
  output: {
    path: resolve('./dist'),
    filename: '[name].[chunkhash:8].js'
  },
  resolve: {
    extensions: [".js", ".json", ".jsx", ".css", "scss"],
    alias: {
      '@': resolve('src'),
    }
  },
  devtool: process.env.NODE_ENV === 'development' ? "source-map" : false,
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
            }
          },
          // Translates CSS into CommonJS
          'css-loader',
          {
            loader: 'postcss-loader', options: {
              index: 'postcss',
              plugins: [
                require('autoprefixer')({
                  overrideBrowserslist: ['last 2 versions', 'ie > 10', 'Firefox >= 60', 'Android >= 4.4', 'iOS >= 9']
                }),
              ]
            }
          },
          // Compiles Sass to CSS
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                fiber: require('fibers'), // close: false
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
            }
          },
          { loader: 'css-loader', options: { importLoaders: 1 } },
          {
            loader: 'postcss-loader', options: {
              index: 'postcss',
              plugins: [
                require('autoprefixer')({
                  overrideBrowserslist: ['last 2 versions', 'ie > 10', 'Firefox >= 60', 'Android >= 4.4', 'iOS >= 9']
                }),
              ]
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        loader: 'url-loader',
        exclude: /node_modules/,
        options: {
          limit: 10000
        }
      },
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
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial' // only package third parties that are initially dependent
        },
        commons: {
          name: 'chunk-commons',
          test: resolve('src/utils'), // can customize your rules
          minChunks: 2, //  公共引入几次才打包进来
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[hash:8].css',
      chunkFilename: '[id].[hash:8].css',
    }),
    ...htmlplugins
  ]
}