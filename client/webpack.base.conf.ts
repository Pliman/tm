import * as path from 'path'
import * as ExtractTextPlugin from 'extract-text-webpack-plugin'

function resolve(dir) {
  return path.join(__dirname, dir)
}

export default {
  entry: {
    browser: [
      resolve('app/entry/App.tsx')
    ],
    mobile: [
      resolve('app/entry/App-h5.tsx')
    ],
    flexible: [
      resolve('app/utils/flexible/flexible.js')
    ]
  },
  output: {
    path: resolve('dist'),
    filename: '[name].js',
    publicPath: './'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [
      resolve('app'),
      resolve('node_modules')
    ],
    alias: {
      app: resolve('app'),
      components: resolve('app/components'),
      utils: resolve('app/utils'),
      constants: resolve('app/config'),
    }
  },
  module: {
    loaders: [
      {
        test: /\.json?$/,
        loader: 'json-loader'
      },
      {
        test: /\.(tsx|ts)$/,
        loader: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.pcss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader'
          ],
        }),
      },
      {
        test: /\.css$/,
        loader: 'css-loader!css?modules&localIdentName=[name]---[local]---[hash:base64:5]'
      },
      {
        test: /\.(woff(2)?|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'file-loader?name=i/[name].[ext]'
      }]
  }
}
