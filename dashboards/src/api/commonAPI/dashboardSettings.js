// @flow
import CustomColors from './customColors';
import type {
	CustomColorsAPI,
	CustomGroupAPI,
	DashboardSettingsAPI,
	PersonalDashboardAPI,
	SettingsDataAPI,
	SourceFiltersAPI,
	WidgetAPI
} from 'api/interfaces';
import CustomGroup from './customGroup';
import PersonalDashboard from './personalDashboard';
import Settings from './settings';
import SourceFilters from './sourceFilters';
import type {Transport} from 'api/types';
import Widget from './widget';

export default class DashboardSettings implements DashboardSettingsAPI {
	transport: Transport;
	sourceFilters: SourceFiltersAPI;
	customColors: CustomColorsAPI;
	customGroup: CustomGroupAPI;
	personalDashboard: PersonalDashboardAPI;
	settings: SettingsDataAPI;
	widget: WidgetAPI;

	constructor (transport: Transport) {
		this.transport = transport;
		this.sourceFilters = new SourceFilters(this.transport);
		this.customColors = new CustomColors(this.transport);
		this.customGroup = new CustomGroup(this.transport);
		this.personalDashboard = new PersonalDashboard(this.transport);
		this.settings = new Settings(this.transport);
		this.widget = new Widget(this.transport);
	}
}
