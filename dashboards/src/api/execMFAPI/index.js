// @flow
import CommonAPI from 'api/commonAPI';
import type {DTOValue, Transport} from 'api/types';
import Frame from 'api/commonAPI/frame';

export const execMFTtransport = (frame: Frame): Transport =>
	async (module: string, method: string, paramNames: Array<string>, ...params: Array<DTOValue>) => {
		const data = await frame.restCallModule(module, method, ...params);
		return JSON.parse(JSON.stringify(data));
	};

export default class ExecMFAPI extends CommonAPI {
	constructor () {
		const frame = new Frame();
		const transport = execMFTtransport(frame);

		super(transport, frame);
	}
}
