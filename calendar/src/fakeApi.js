import config from '../config/dev.json';
import delayMockResponse from 'utils/delayMockResponse';
import fieldCalendarData from 'mock/fieldCalendar.json';
import fieldLocationData from 'mock/fieldLocation.json';
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

const jsApi = {
	restCallModule,
};

export default jsApi;
