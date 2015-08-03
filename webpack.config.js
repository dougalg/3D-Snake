var webpack = require('webpack');
module.exports = {
    context: __dirname,
    entry: "./src/js/app",
    output: {
        path: "dist",
        filename: "app.js"
    },
    resolve: {
        extensions: [ ".js", ".scss", "" ],
        modulesDirectories: [ "bower_components", "node_modules" ]
    },
    devtool: "source-map",
    module: {
        loaders: [
            { test: /\.scss$/, loader: "style-loader!css-loader!sass-loader" },
            { test: /src\/js\/.*\.js$/, loader: "babel-loader" },
            { test: /threejs\/build\/three/, loader: "exports-loader", query: "THREE=THREE" }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
};