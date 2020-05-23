/* eslint-disable */
const getCurrentContentParameters = async () => await ({
	editable: true,
	MinTimeIntervalUpdate: 3
});

const getCurrentContextObject = async () => await ({
	metaClass: 'employee$employee'
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
