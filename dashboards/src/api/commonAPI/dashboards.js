// @flow
import type {DTOValue, Transport} from 'api/types';
import type {DashboardsAPI} from 'api/interfaces';

export default class Dashboards implements DashboardsAPI {
	transport: Transport;

	constructor (transport: Transport) {
		this.transport = transport;
	}

	checkForParent (parentClassFqn: string, childClassFqn: string) {
		return this.transport('dashboards', 'checkForParent', ['parentClassFqn', 'childClassFqn'], parentClassFqn, childClassFqn);
	}

	getAttributeObject (request: DTOValue) {
		return this.transport('dashboards', 'getAttributeObject', ['requestContent'], request);
	}

	getAttributesFromLinkAttribute (request: DTOValue) {
		return this.transport('dashboards', 'getAttributesFromLinkAttribute', ['requestContent'], request);
	}

	getCardObject (value: DTOValue) {
		return this.transport('dashboards', 'getCardObject', ['value'], value);
	}

	getCatalogItemObject (property: DTOValue) {
		return this.transport('dashboards', 'getCatalogItemObject', ['requestContent'], {property});
	}

	getCatalogObject (property: DTOValue) {
		return this.transport('dashboards', 'getCatalogObject', ['requestContent'], {property});
	}

	getDashboardLink (dashboardId: string) {
		return this.transport('dashboards', 'getDashboardLink', ['dashboardCode'], dashboardId);
	}

	getDataSourceAttributes (params: DTOValue) {
		return this.transport('dashboards', 'getDataSourceAttributes', ['requestContent'], params);
	}

	getDataSources () {
		return this.transport('dashboards', 'getDataSources', []);
	}

	getDynamicAttributeGroups (actualDescriptor: DTOValue) {
		return this.transport('dashboards', 'getDynamicAttributeGroups', ['descriptor'], actualDescriptor);
	}

	getDynamicAttributes (groupCode: DTOValue) {
		return this.transport('dashboards', 'getDynamicAttributes', ['groupUUID'], groupCode);
	}

	getLinkedDataSources (payload: DTOValue) {
		return this.transport('dashboards', 'getLinkedDataSources', ['requestContent'], payload);
	}

	getMetaClasses (metaClassFqn: string) {
		return this.transport('dashboards', 'getMetaClasses', ['classFqn'], metaClassFqn);
	}

	getStates (metaClassFqn: string) {
		return this.transport('dashboards', 'getStates', ['classFqn'], metaClassFqn);
	}

	searchValue (request: DTOValue) {
		return this.transport('dashboards', 'searchValue', ['requestContent'], request);
	}
}
