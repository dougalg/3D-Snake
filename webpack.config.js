module.exports = {
    context: __dirname,
    entry: "./src/js/app",
    output: {
        path: "dist",
        filename: "app.js"
    },
    resolve: {
        extensions: [ ".js", ".css", "" ],
        modulesDirectories: [ "bower_components", "node_modules" ]
    },
    devtool: "source-map",
    module: {
        loaders: [
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /src\/js\/.*\.js$/, loader: "babel-loader" },
            { test: /threejs\/build\/three/, loader: "exports-loader", query: "THREE=THREE" }
        ]
    }
};