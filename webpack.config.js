const path = require('path');

module.exports = {
    mode: 'development',
    target: 'electron-main', // or 'electron-renderer' depending on the context
    entry: ['./src/renderer/mainRenderer.js', './styles/main.scss'],
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js'
    },
    externals: {
        electron: 'commonjs2 electron', // This prevents bundling of Electron
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    resolve: {
        fallback: {
            "fs": false, // Ignore fs as well
            "path": require.resolve("path-browserify") // Provide a browser-compatible version of path
        }
    }
};
