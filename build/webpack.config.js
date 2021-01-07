// webpack.config.js

const path = require('path')
// const Webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HappyPack = require('happypack')
const os = require('os')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const devMode = process.argv.indexOf('--mode=production') === -1

module.exports = {
  entry: ['@babel/polyfill', path.resolve(__dirname, '../src/main.js')], // 入口文件
  output: {
    filename: '[name].[contenthash:8].js', // 打包后的文件名称
    path: path.resolve(__dirname, '../dist'), // 打包后输出的文件所在的目录
    chunkFilename: 'js/[name]:[contenthash:8].js'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      'assets': path.resolve('src/assets'),
      'components': path.resolve('src/components')
    },
    extensions: ['*', '.js', '.json']
  },
  externals: {
    // 这里写一些不想让webpack构建打包的静态资源
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'happypack/loader?id=happyBabel',
          // options: {
          //   presets: ['@babel/preset-env']
          // }
        }],
        include: [path.resolve(__dirname, '../src')],
        exclude: /node_modules/
      },
      {
        test: /\.(css|less)$/,
        use: ['style-loader', {
          loader: 'css-loader',
          options: {
            modules: true
          }
        }], // 从右向左解析
        exclude: /node_modules/
      },
      {
        test: /\.(css|less)$/,
        use: ['style-loader', 'css-loader', {
          loader: 'less-loader',
          options: { 
            sourceMap: true 
          }
        }], // 从右向左解析
        include: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'], // 从右向左解析
        exclude: /node_modules/
      },
      {
        test: /\.(jpe?g|png|gif)$/i, // 图片文件
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'img/[name].[contenthash:8].[ext]',
                  esModule: false
                }
              },
              esModule: false
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, // 媒体文件
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[contenthash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options:{
                  name: 'fonts/[name].[contenthash:8].[ext]'
                }
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html')
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css'
    }),
    new HappyPack({
      id: 'happyBabel', // 与loader对应的id标识
      loaders: [ // 用法和loader的配置一样，注意这里是loaders
        {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { modules: false }], // 解决babel tree-shaking的坑
              ['@babel/preset-react']
            ],
            cacheDirectory: true
          }
        }
      ],
      threadPool: happyThreadPool // 共享进程池
    }),
    // new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: require('../static/js/react-manifest.json')
    // }),
    // new CopyWebpackPlugin({ // 拷贝生成的文件到dist目录 这样每次不必手动去cv
    //   patterns:
    //   [{
    //     from: path.resolve(__dirname, '../static/js'),
    //     to: path.resolve(__dirname, 'dist')
    //   }]
    // })
  ]
}