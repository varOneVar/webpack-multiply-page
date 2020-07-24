const HtmlWebpackPlugin = require('html-webpack-plugin')

const commonChunk = {
  meta: {
    viewport: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no,minimal-ui'
  }
}

const htmlConfigArr = [{
  ...commonChunk,
  title: 'index.html',
  filename: 'index.html',
  template: './src/views/index.html',
  chunks: ['index'],
}, {
  ...commonChunk,
  title: 'about.html',
  filename: 'about.html',
  template: './src/views/about.html',
  chunks: ['about'],
}]
const result = htmlConfigArr.map(option => new HtmlWebpackPlugin(option))

module.exports = result