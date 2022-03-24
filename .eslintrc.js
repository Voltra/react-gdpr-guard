/* eslint-env node */

module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es6: true,
		jest: true,
	},
	parser: "@typescript-eslint/parser",
	extends: [
		"eslint:recommended",
		"airbnb",
		"airbnb/hooks",
		"plugin:react/recommended",
		"plugin:react-hooks/recommended",
		"plugin:prettier/recommended",
		"plugin:import/errors",
		"plugin:import/warnings",
		"plugin:react-perf/recommended",
		"standard",
		"standard-react",
		"prettier",
		"plugin:@typescript-eslint/eslint-recommended",
	],
	parserOptions: {
		ecmaVersion: 2022,
		ecmaFeatures: {
			legacyDecorators: true,
			jsx: true,
		},
	},
	plugins: ["react-perf", "unused-imports"],
	reportUnusedDisableDirectives: true,
	settings: {
		react: {
			version: "detect",
		},
		"import/resolver": {
			alias: {
				extensions: [".ts", ".d.ts"],
			},
		},
	},
	rules: {
		"no-return-await": "error",
		"no-underscore-dangle": "off",
		"spaced-comment": "off",
		// "nonblock-statement-body-position": ["error", "below"],
		"import/prefer-default-export": "off",
		"import/no-extraneous-dependencies": "off",
		"import/order": [
			"error",
			{
				"newlines-between": "always",
				groups: [
					"builtin",
					"external",
					"internal",
					"parent",
					"sibling",
					"index",
					"object",
				],
				alphabetize: {
					order: "asc",
					caseInsensitive: true,
				},
			},
		],
		"import/extensions": "off",
		"unused-imports/no-unused-imports": "error",
		"react/jsx-props-no-spreading": "off",
		"react/prop-types": "off",
		"prettier/prettier": ["error", {}, { usePrettierrc: true }],
	},
};
