module.exports = {
	extends: [
		'react-app',
		'plugin:import/errors'
	],
	rules: {
		indent: [
			'error',
			'tab',
			{
				MemberExpression: 1
			}
		],
		'no-mixed-spaces-and-tabs': 'error'
	},
	settings: {
		react: {
			pragma: 'h'
		},
		'import/resolver': 'webpack'
	}
}
