module.exports = {
	env: {
		browser: true,
	},
	extends: [
		'airbnb',
	],
	rules: {
		indent: [
			'error',
			'tab',
			{
				MemberExpression: 1,
			}
		],
		'no-mixed-spaces-and-tabs': 'error',
		'no-tabs': 'off',
		'no-param-reassign': 'off',
		'no-plusplus': 'off',
		'arrow-parens': 'off',
		'no-return-assign': 'off',

		'react/jsx-indent': ['error', 'tab'],
		'react/jsx-filename-extension': 'off',
	},
	settings: {
		react: {
			pragma: 'h',
		},
	},
}
