// @flow
import type {FilterFormAPI, FrameAPI} from 'api/interfaces';
import type {FilterFormContextDTO, FilterFormOptionsDTO, Transport} from 'api/types';

export default class FilterForm implements FilterFormAPI {
	transport: Transport;
	frame: FrameAPI;

	constructor (transport: Transport, frame: FrameAPI) {
		this.transport = transport;
		this.frame = frame;
	}

	openForm (context: FilterFormContextDTO, options: FilterFormOptionsDTO) {
		return this.frame.openFilterForm(context, options);
	}
}
