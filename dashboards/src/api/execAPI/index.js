// @flow
import {buildRequestParams, parseError} from './utils';
import CommonAPI from 'api/commonAPI';
import type {DTOValue, Transport} from 'api/types';
import Frame from 'api/commonAPI/frame';
import type {FrameAPI} from 'api/interfaces';

export const execAPITransport = (frame: FrameAPI): Transport => {
	const embeddedApplicationCode = frame.getApplicationCode();

	return async (module: string, method: string, paramNames: Array<string>, ...params: Array<DTOValue>) => {
		try {
			const {body, httpMethod, url} = buildRequestParams(module, method, paramNames, params);
			const response = await frame.restCallAsJson(url, {
				body: body ? JSON.stringify(body) : undefined,
				headers: {embeddedApplicationCode: embeddedApplicationCode},
				method: httpMethod
			});

			return response;
		} catch (e) {
			console.error('Transport: ', e);
			const error = parseError(e);

			throw error;
		}
	};
};

export default class ExecAPI extends CommonAPI {
	constructor () {
		const frame = new Frame();
		const transport = execAPITransport(frame);

		super(transport, frame);
	}
}
