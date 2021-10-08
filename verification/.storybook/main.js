const customConfig = require('../webpack/config');

module.exports = {
	'addons': [
		'@storybook/addon-essentials',
		'@storybook/addon-links'
	],
	'stories': ['../src/**/*.stories.@(js|jsx)'],
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
