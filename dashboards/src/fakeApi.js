/* eslint-disable */
const getCurrentContentParameters = async () => await ({
	editable: true,
	MinTimeIntervalUpdate: 3
});

const getCurrentContextObject = async () => await ({
	metaClass: process.env.CONTEXT_OBJECT_META_CLASS
});

const commands = {
	getCurrentContentParameters,
	getCurrentContextObject
};
const extractSubjectUuid = () => process.env.SUBJECT_UUID;
const findContentCode = () => process.env.CONTENT_CODE;

const jsApi = {
	commands,
	extractSubjectUuid,
	findContentCode
};

if (process.env.NODE_ENV === 'development') {
	window.jsApi = jsApi;
}
