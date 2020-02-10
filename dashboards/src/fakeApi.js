/* eslint-disable */
const getCurrentContentParameters = async () => await ({
	editable: true,
	autoUpdateInterval: 15
});

const getCurrentContextObject = async () => await ({
	metaClass: 'asdasd'
});

const commands = {
	getCurrentContentParameters,
	getCurrentContextObject
};
const extractSubjectUuid = () => 'employee$2384002';
const findContentCode = () => 'TestZhdanovaasdasd';

const jsApi = {
	commands,
	extractSubjectUuid,
	findContentCode
};

if (process.env.NODE_ENV === 'development') {
	window.jsApi = jsApi;
}
