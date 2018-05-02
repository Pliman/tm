import * as webpack from 'webpack'

import * as merge from 'webpack-merge'
import baseConfig from './webpack.base.conf'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as ExtractTextPlugin from 'extract-text-webpack-plugin'

Object.keys(baseConfig.entry).forEach(function (name) {
    baseConfig.entry[name] = ['webpack-hot-middleware/client?reload=true'].concat(baseConfig.entry[name])
})

export default merge(baseConfig, {
    devtool: 'eval-source-map',
    output: {
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'app/entry/index.html',
            filename: 'index.html',
            inject: false,
            chunks: ['browser', 'ieCompatible']
        }),
        new HtmlWebpackPlugin({
            template: 'app/entry/index-h5.html',
            inject: false,
            filename: 'index-h5.html',
            chunks: ['mobile', 'flexible']
        }),
        new ExtractTextPlugin('[name].css'),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ]
})
