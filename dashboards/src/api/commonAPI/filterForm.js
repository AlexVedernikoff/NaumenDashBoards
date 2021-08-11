// @flow
import type {FilterFormAPI, FrameAPI} from 'api/interfaces';
import type {FilterFormDescriptorDTO, Transport} from 'api/types';

export default class FilterForm implements FilterFormAPI {
	transport: Transport;
	frame: FrameAPI;

	constructor (transport: Transport, frame: FrameAPI) {
		this.transport = transport;
		this.frame = frame;
	}

	openForm (descriptor: FilterFormDescriptorDTO, useAttrFilter?: boolean) {
		return this.frame.openFilterForm(descriptor, useAttrFilter);
	}
}
