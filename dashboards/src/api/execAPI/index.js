// @flow
import {buildRequestParams} from './utils';
import CommonAPI from 'api/commonAPI';
import type {DTOValue, Transport} from 'api/types';
import Frame from 'api/commonAPI/frame';
import type {FrameAPI} from 'api/interfaces';
import {parseError} from './parseError';

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
	constructor (transport: ?Transport = null, frame: ?FrameAPI = null) {
		const useFrame = frame ?? new Frame();
		const useTransport = transport ?? execAPITransport(useFrame);

		super(useTransport, useFrame);
	}
}
