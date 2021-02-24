const customConfig = require('../webpack/config');

module.exports = {
	'stories': ['../src/**/*.stories.@(js|jsx)'],
	'addons': [
		'@storybook/addon-actions',
		'@storybook/addon-links',
		'@storybook/addon-essentials'
	],
	webpackFinal: config => ({
		...config,
		module: {
			...config.module,
			rules: customConfig.module.rules,
		},
		plugins: [...config.plugins, ...customConfig.plugins],
		resolve: {
			...config.resolve,
			alias: {
				...config.resolve.alias,
				...customConfig.resolve.alias
			},
			modules: customConfig.resolve.modules
		}
	})
}
