module.exports = function (api) {
	api.cache(false);
	const presets = [
		['@babel/preset-react'],
		[
			'@babel/preset-env',
			{
				corejs: 3,
				useBuiltIns: 'entry'
			}
		],
		['@babel/preset-flow']
	];
	return {
		presets
	};
};
