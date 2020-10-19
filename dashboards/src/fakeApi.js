/* eslint-disable */
const getCurrentContentParameters = async () => await ({
	editable: true,
	MinTimeIntervalUpdate: 3
});

const getCurrentContextObject = async () => await ({
	card_caption: 'Сотрудник "Петров Петр Петрович"',
	metaClass: process.env.CONTEXT_OBJECT_META_CLASS
});

const commands = {
	getCurrentContentParameters,
	getCurrentContextObject
};
const extractSubjectUuid = () => process.env.SUBJECT_UUID;
const findContentCode = () => process.env.CONTENT_CODE;
const getCurrentUser = () => ({
	uuid: process.env.USER_UUID
})

const restCallModule = async (module, method, ...params) => {
	try {
		const response = await fetch(`/sd/services/rest/execmf?accessKey=${process.env.ACCESS_KEY}`, {
			body: JSON.stringify([{module, method, params}]),
			method: 'POST'
		});
		const {ok, status, statusText} = response;

		if (ok) {
			const data = await response.json();
			return JSON.parse(data[0]);
		}

		throw {
			status,
			statusText,
			responseText: await response.text()
		}
	} catch (e) {
		throw e;
	}
}

const jsApi = {
	commands,
	extractSubjectUuid,
	findContentCode,
	getCurrentUser,
	restCallModule
};

if (process.env.NODE_ENV === 'development') {
	window.jsApi = jsApi;
}
