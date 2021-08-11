// @flow
import type {DashbordParams, SourceFilterDTO, Transport} from 'api/types';
import type {SourceFiltersAPI} from 'api/interfaces';

export default class SourceFilters implements SourceFiltersAPI {
	transport: Transport;

	constructor (transport: Transport) {
		this.transport = transport;
	}

	check (dashboardKey: string, sourceFilter: SourceFilterDTO) {
		return this.transport('dashboardSettings', 'filterIsBadToApply', ['requestContent'], { dashboardKey, sourceFilter });
	}

	delete (filterId: string) {
		return this.transport('dashboardSettings', 'deleteSourceFilters', ['sourceFilterUUID'], filterId);
	}

	getAll (metaClass: string) {
		return this.transport('dashboardSettings', 'getSourceFilters', ['metaClass'], metaClass);
	}

	save (dashboard: DashbordParams, sourceFilter: SourceFilterDTO) {
		return this.transport('dashboardSettings', 'saveSourceFilters', ['requestContent'], {dashboard, sourceFilter});
	}
}
