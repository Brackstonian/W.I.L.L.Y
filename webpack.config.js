const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    target: 'electron-renderer',
    entry: {
        home: ['./src/renderer/pages/homePage.js', './styles/pages/homePage.scss'],
        share: ['./src/renderer/pages/sharePage.js', './styles/pages/sharePage.scss'],
        view: ['./src/renderer/pages/viewPage.js', './styles/pages/viewPage.scss']
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].bundle.js'
    },
    watch: true,
    externals: {
        electron: 'commonjs2 electron',
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ],
    resolve: {
        fallback: {
            "fs": false,
            "path": require.resolve("path-browserify")
        }
    }
};
