const {production} = require('./define');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const optimization = production
	? {
		minimizer: [
			new UglifyJsPlugin({
				cache: false
			})
		]
	}
	: {};

module.exports = optimization;
