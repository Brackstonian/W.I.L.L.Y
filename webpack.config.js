const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    target: 'web',
    node: {
        __dirname: false,
        __filename: false,
        global: true,
    },
    entry: {
        home: ['./src/renderer/pages/home.js', './styles/pages/home.scss'],
        share: ['./src/renderer/pages/share.js', './styles/pages/share.scss'],
        view: ['./src/renderer/pages/view.js', './styles/pages/view.scss'],
        overlay: ['./src/renderer/pages/overlay.js', './styles/pages/overlay.scss'],
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'js/[name].bundle.js'
    },
    watch: true,
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            },
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: "javascript/auto",
                resolve: {
                    fullySpecified: false // This will disable the need to have an extension specified in imports within .mjs files
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser'
        })
    ],
    resolve: {
        extensions: ['.js', '.mjs', '.json'],
        alias: {
            'process': require.resolve('process/browser'),
            'process/browser': require.resolve('process/browser')
        },
        fallback: {
            "process/browser": require.resolve("process/browser"),
            "process": require.resolve("process/browser"),
            "fs": false,
            "path": require.resolve("path-browserify"),
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer/")
        },
    },
    externals: {
        electron: 'commonjs2 electron',
    }
};
