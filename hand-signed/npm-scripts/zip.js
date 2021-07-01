const {exec} = require('child_process');
const os = require('os');

const inspect = (error, stdout, stderr) => {
	if (error) {
		process.stdout.write(error);
		return;
	}

	process.stdout.write(stdout);
	process.stdout.write(stderr);
};

if (os.type() === 'Windows_NT') {
	exec('cd dist/ && bestzip ../"%npm_package_name%-v.%npm_package_version%.zip" *', inspect);
} else {
	exec('cd dist/ && bestzip ../"$npm_package_name-v.$npm_package_version.zip" *', inspect);
}
