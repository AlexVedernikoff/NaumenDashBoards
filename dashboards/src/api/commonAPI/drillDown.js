// @flow
import type {DTOValue, Transport} from 'api/types';
import type {DrillDownAPI} from 'api/interfaces';

export default class DrillDown implements DrillDownAPI {
	transport: Transport;

	constructor (transport: Transport) {
		this.transport = transport;
	}

	getLink (payload: DTOValue, cardObjectUuid: string, diagramTypeFromRequest: string, dashboardKey: string, groupCode: string = '') {
		return this.transport(
			'dashboardDrilldown',
			'getLink',
			['requestContent'],
			{
				...payload,
				cardObjectUuid,
				dashboardKey,
				diagramTypeFromRequest,
				groupCode,
				offsetUTCMinutes: -(new Date()).getTimezoneOffset()
			}
		);
	}
}
