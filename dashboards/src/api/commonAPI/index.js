// @flow
import type {
	API,
	DashboardDataSetAPI,
	DashboardSettingsAPI,
	DashboardsAPI,
	DrillDownAPI,
	FileToMailAPI,
	FilterFormAPI,
	FrameAPI
} from 'api/interfaces';
import DashboardDataSet from './dashboardDataSet';
import DashboardSettings from './dashboardSettings';
import Dashboards from './dashboards';
import DrillDown from './drillDown';
import FileToMail from './fileToMail';
import FilterForm from './filterForm';
import type {Transport} from 'api/types';

export default class CommonAPI implements API {
	transport: Transport;
	frame: FrameAPI;
	dashboardDataSet: DashboardDataSetAPI;
	dashboards: DashboardsAPI;
	dashboardSettings: DashboardSettingsAPI;
	drillDown: DrillDownAPI;
	fileToMail: FileToMailAPI;
	filterForm: FilterFormAPI;

	constructor (transport: Transport, frame: FrameAPI) {
		this.transport = transport;
		this.frame = frame;
		this.dashboardDataSet = new DashboardDataSet(this.transport);
		this.dashboardSettings = new DashboardSettings(this.transport);
		this.dashboards = new Dashboards(this.transport);
		this.drillDown = new DrillDown(this.transport);
		this.fileToMail = new FileToMail(this.transport);
		this.filterForm = new FilterForm(this.transport);
	}
}
