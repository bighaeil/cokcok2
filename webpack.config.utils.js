const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

function getEntry(pages) {
    var entryFiles = {};

    for (var i=0; i<pages.length; i++) {
        var page = pages[i];
        entryFiles[page.script] = './src/js/' + page.script;
    }

    return entryFiles;
}

function getHtmlPlugins(pages) {
    var plugins = [];

    for (var i=0; i<pages.length; i++) {
        var page = pages[i];

        plugins.push(new HtmlWebpackPlugin({
            filename: page.html + '.html',
            template: 'src/' + page.html + '.hbs',
            chunks: [page.script],
            minify: {
                collapseWhitespace: true,
                preserveLineBreaks: false
            }
        }));
    }

    return plugins;
}

function getPlugins(pages) {
    var plugins = [
        new CleanWebpackPlugin(['dist']),
        new CopyWebpackPlugin([{
            from: 'src/img',
            to: 'img/',
            ignore: ['.gitignore']
        }, {
            from: 'node_modules/bootstrap/dist/css',
            to: 'vendor/bootstrap/css/'
        }, {
            from: 'node_modules/bootstrap/dist/fonts',
            to: 'vendor/bootstrap/fonts/'
        }, {
            from: 'node_modules/font-awesome/css',
            to: 'vendor/font-awesome/css/'
        }, {
            from: 'node_modules/font-awesome/fonts',
            to: 'vendor/font-awesome/fonts/'
        }]),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new ExtractTextWebpackPlugin('css/[name].[chunkhash].css'),
        new HtmlWebpackIncludeAssetsPlugin({
            assets: ['vendor/font-awesome/css/font-awesome.min.css'],
            append: false
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            assets: ['vendor/bootstrap/css/bootstrap.min.css'],
            append: false
        })
    ];

    plugins = plugins.concat(getHtmlPlugins(pages));

    return plugins;
}

module.exports = {
    getEntry: getEntry,
    getPlugins: getPlugins
};