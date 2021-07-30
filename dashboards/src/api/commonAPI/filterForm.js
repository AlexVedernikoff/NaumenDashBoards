// @flow
import type {FilterFormAPI} from 'api/interfaces';
import type {FilterFormDescriptorDTO, Transport} from 'api/types';

export default class FilterForm implements FilterFormAPI {
	transport: Transport;

	constructor (transport: Transport) {
		this.transport = transport;
	}

	openForm (descriptor: FilterFormDescriptorDTO, useAttrFilter?: boolean) {
		return window.jsApi.commands.filterForm(descriptor, useAttrFilter);
	}
}
