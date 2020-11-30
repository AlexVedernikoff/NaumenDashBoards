import config from '../config/dev.json';
import delayMockResponse from 'utils/delayMockResponse';
import fieldCalendarData from 'mock/fieldCalendar.json';
import fieldLocationData from 'mock/fieldLocation.json';
import getEventStatesColors from 'mock/getEventStatesColors.json';
import getEvents from 'mock/getEvents.json';

/* eslint-disable */
const getMockData = async (method: string) => {
	switch (method) {
		case 'getCalendars': {
			return await delayMockResponse(fieldCalendarData);
		}
		case 'getEvents': {
			return await delayMockResponse(getEvents);
		}
		case 'getEventStatesColors': {
			return await delayMockResponse(getEventStatesColors);
		}
		case 'getLocations': {
			return await delayMockResponse(fieldLocationData);
		}
		default:
			throw new Error("Passed method not supported");
	}
};

const restCallModule = async (module, method, ...params) => {
	if (process.env.API === "local") {
		return getMockData(method);
	}

	try {
		const response = await fetch(
			`/sd/services/rest/execmf?accessKey=${config.accessKey}`,
			{
				body: JSON.stringify([{ module, method, params }]),
				method: "POST",
			}
		);
		const { ok, status, statusText } = response;

		if (ok) {
			const data = await response.json();
			return JSON.parse(data[0]);
		}

		throw {
			status,
			statusText,
			responseText: await response.text(),
		};
	} catch (e) {
		throw e;
	}
};

const getParameters = async () => await ({
	DefaultMode: '{week=Неделя}',
	SkryvatSubbotuIVoskresene: false
});

const jsApi = {
	contents: {
		getParameters
	},
	restCallModule
};

export default jsApi;
