// @flow
import type {DTOValue, Transport} from 'api/types';
import type {DashboardDataSetAPI} from 'api/interfaces';

export default class DashboardDataSet implements DashboardDataSetAPI {
	transport: Transport;

	constructor (transport: Transport) {
		this.transport = transport;
	}

	getDataForCompositeDiagram (
		dashboardId: string,
		widgetId: string,
		subjectUUID: string,
		widgetFilters: Array<DTOValue>
	) {
		return this.transport(
			'dashboardDataSet',
			'getDataForCompositeDiagram',
			dashboardId,
			widgetId,
			subjectUUID,
			widgetFilters
		);
	}

	getDataForTableDiagram (
		dashboardId: string,
		widgetId: string,
		subjectUUID: string,
		requestData: DTOValue,
		widgetFilters: Array<DTOValue>
	) {
		return this.transport(
			'dashboardDataSet',
			'getDataForTableDiagram',
			dashboardId,
			widgetId,
			subjectUUID,
			requestData,
			widgetFilters
		);
	}
}
