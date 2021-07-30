// @flow
import type {DTOValue, Transport} from 'api/types';
import type {DashboardsAPI} from 'api/interfaces';

export default class Dashboards implements DashboardsAPI {
	transport: Transport;

	constructor (transport: Transport) {
		this.transport = transport;
	}

	checkForParent (mainValue: string, value: string) {
		return this.transport('dashboards', 'checkForParent', mainValue, value);
	}

	getAttributeObject (request: DTOValue) {
		return this.transport('dashboards', 'getAttributeObject', request);
	}

	getAttributesFromLinkAttribute (request: DTOValue) {
		return this.transport('dashboards', 'getAttributesFromLinkAttribute', request);
	}

	getCardObject (value: DTOValue) {
		return this.transport('dashboards', 'getCardObject', value);
	}

	getCatalogItemObject (property: DTOValue) {
		return this.transport('dashboards', 'getCatalogItemObject', {property});
	}

	getCatalogObject (property: DTOValue) {
		return this.transport('dashboards', 'getCatalogObject', {property});
	}

	getDashboardLink (dashboardId: string) {
		return this.transport('dashboards', 'getDashboardLink', dashboardId);
	}

	getDataSourceAttributes (params: DTOValue) {
		return this.transport('dashboards', 'getDataSourceAttributes', params);
	}

	getDataSources () {
		return this.transport('dashboards', 'getDataSources');
	}

	getDynamicAttributeGroups (actualDescriptor: DTOValue) {
		return this.transport('dashboards', 'getDynamicAttributeGroups', actualDescriptor);
	}

	getDynamicAttributes (groupCode: DTOValue) {
		return this.transport('dashboards', 'getDynamicAttributes', groupCode);
	}

	getLinkedDataSources (payload: DTOValue) {
		return this.transport('dashboards', 'getLinkedDataSources', payload);
	}

	getMetaClasses (metaClassFqn: string) {
		return this.transport('dashboards', 'getMetaClasses', metaClassFqn);
	}

	getStates (metaClassFqn: string) {
		return this.transport('dashboards', 'getStates', metaClassFqn);
	}

	searchValue (request: DTOValue) {
		return this.transport('dashboards', 'searchValue', request);
	}
}
