const CircularDependencyPlugin = require('circular-dependency-plugin');
// MiniCssExtractPlugin заменяет ExtractTextWebpackPlugin и выполняет ту же задачу (сборку css в один файл)
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const plugins = [
	new MiniCssExtractPlugin({
		filename: '[name].css'
	}),
	new CircularDependencyPlugin()
	// new BundleAnalyzerPlugin()
];

module.exports = plugins;
