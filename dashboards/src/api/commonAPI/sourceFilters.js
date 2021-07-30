// @flow
import type {DashbordParams, SourceFilterDTO, Transport} from 'api/types';
import type {SourceFiltersAPI} from 'api/interfaces';

export default class SourceFilters implements SourceFiltersAPI {
	transport: Transport;

	constructor (transport: Transport) {
		this.transport = transport;
	}

	check (dashboardKey: string, sourceFilter: SourceFilterDTO) {
		return this.transport('dashboardSettings', 'filterIsBadToApply', { dashboardKey, sourceFilter });
	}

	delete (filterId: string) {
		return this.transport('dashboardSettings', 'deleteSourceFilters', filterId);
	}

	getAll (metaClass: string) {
		return this.transport('dashboardSettings', 'getSourceFilters', metaClass);
	}

	save (dashboard: DashbordParams, sourceFilter: SourceFilterDTO) {
		return this.transport('dashboardSettings', 'saveSourceFilters', {dashboard, sourceFilter});
	}
}
