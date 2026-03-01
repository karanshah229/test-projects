// Since this file exists, next will use babel instead of swr

const babelConfig = {
	presets: ["next/babel"],
	plugins: [
		[
			"module-resolver",
			{
				alias: {
					// Add similar paths in tsconfig
					"@hackerrank/hrds":
						"@hackerrank/hrds-components/dist/esm/index",
				},
			},
		],
	],
};

module.exports = babelConfig;
