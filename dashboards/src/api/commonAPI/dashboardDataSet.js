// @flow
import type {DTOValue, Transport} from 'api/types';
import type {DashboardDataSetAPI} from 'api/interfaces';

export default class DashboardDataSet implements DashboardDataSetAPI {
	transport: Transport;

	constructor (transport: Transport) {
		this.transport = transport;
	}

	getDataForCompositeDiagram (
		dashboardKey: string,
		widgetKey: string,
		cardObjectUuid: string,
		widgetFilters: Array<DTOValue>
	) {
		return this.transport(
			'dashboardDataSet',
			'getDataForCompositeDiagram',
			['requestContent'],
			{
				cardObjectUuid,
				dashboardKey,
				offsetUTCMinutes: -(new Date()).getTimezoneOffset(),
				widgetFilters,
				widgetKey
			}
		);
	}

	getDataForTableDiagram (
		dashboardKey: string,
		widgetKey: string,
		cardObjectUuid: string,
		tableRequestSettings: DTOValue,
		widgetFilters: Array<DTOValue>
	) {
		return this.transport(
			'dashboardDataSet',
			'getDataForTableDiagram',
			['requestContent'],
			{
				cardObjectUuid,
				dashboardKey,
				offsetUTCMinutes: -(new Date()).getTimezoneOffset(),
				tableRequestSettings,
				widgetFilters,
				widgetKey
			}
		);
	}
}
