// @flow
import CommonAPI from 'api/commonAPI';
import {execAPITransport} from 'api/execAPI';
import Frame from './frame';
import type {Transport} from 'api/types';

const fakeExecAPITransportDecorator = (transport: Transport) => {
	return async (...params) => {
		const response = await transport(...params);
		return response.json();
	};
};

export default class FakeExecAPI extends CommonAPI {
	constructor () {
		const frame = new Frame();
		const transport = fakeExecAPITransportDecorator(execAPITransport(frame));

		super(transport, frame);
	}
}
