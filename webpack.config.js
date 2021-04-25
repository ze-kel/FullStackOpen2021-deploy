const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = (env, argv) => {
    const { mode } = argv
    const additionalPlugins =
        mode === 'production' ? [] : [new webpack.HotModuleReplacementPlugin()] // Enable hot module replacement

    const additionalEntries =
        mode === 'production'
            ? []
            : ['webpack-hot-middleware/client?http://localhost:8000']

    return {
        mode,
        entry: [
            '@babel/polyfill', // so we don't need to import it anywhere
            './client',
            ...additionalEntries,
        ],
        resolve: {
            alias: {
                '@root': path.resolve(__dirname),
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader', 'postcss-loader'],
                },
                {
                    test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                    use: ['file-loader'],
                },
            ],
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.BUILT_AT': JSON.stringify(
                    new Date().toISOString()
                ),
                'process.env.NODE_ENV': JSON.stringify(mode),
            }),
            // Skip the part where we would make a html template
            new HtmlWebpackPlugin({
                template: 'index.html',
                favicon: path.resolve(__dirname, 'client/assets/favicon.ico'),
            }),
            ...additionalPlugins,
        ],
    }
}
