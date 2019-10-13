const path = require('path');

module.exports = {
    mode: "production",
    context: __dirname,
    entry: "./src/js/app",
    output: {
        path: path.join(__dirname, 'dist/'),
        filename: "app.js"
    },
    resolve: {
        extensions: [ ".js", ".scss" ],
        modules: [ "node_modules" ]
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                outputStyle: 'compressed',
                            },
                        },
                    },
                ],
            },
        ],
    },
};