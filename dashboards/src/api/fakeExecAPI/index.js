// @flow
import CommonAPI from 'api/commonAPI';
import {execAPITransport} from 'api/execAPI';
import Frame from './frame';
import {parseError} from 'api/execAPI/parseError';
import type {Transport} from 'api/types';

const fakeExecAPITransportDecorator = (transport: Transport) => {
	return async (...params) => {
		const response = await transport(...params);

		if (response.ok) {
			return response.json();
		}

		const error = parseError({
			...response,
			responseText: await response.text()
		});

		throw error;
	};
};

export default class FakeExecAPI extends CommonAPI {
	constructor () {
		const frame = new Frame();
		const transport = fakeExecAPITransportDecorator(execAPITransport(frame));

		super(transport, frame);
	}
}
