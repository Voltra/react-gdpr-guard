module.exports = {
	out: "docs",
	emit: "docs",
	entryPointStrategy: "expand",
	entryPoints: ["src/"],
	categorizeByGroup: false,
	exclude: ["node_modules/"],
	theme: "default",
	includeVersion: true,
	readme: "README.md",
	githubPages: true,

	// mode: "file",
	hideGenerator: true,
};
