// @flow
import {createContextName, getSnapshotName} from './helpers';
import exportSheet from './xlxs';
import {exportPDF} from './pdf';
import {exportPNG} from './core';
import {FILE_VARIANTS} from './constants';
import type {TableBuildData} from 'store/widgets/buildData/types';
import type {TableWidget, Widget} from 'store/widgets/data/types';

class Exporter {
	store: {[id: string]: HTMLDivElement};
	layout: Array<string>;

	constructor () {
		this.store = {};
		this.layout = [];
	}

	getWidgetContainer (widgetId: string): ?HTMLDivElement {
		if (widgetId in this.store) {
			return this.store[widgetId];
		}

		return null;
	}

	registerWidgetContainer (widgetId: string, container: HTMLDivElement) {
		this.store[widgetId] = container;
	}

	unregisterWidgetContainer (widgetId: string) {
		delete this.store[widgetId];
	}

	setLayout (layout: Array<string>) {
		this.layout = layout;
	}

	/* depricated */
	async createContextName () {
		const contextName = await createContextName();
		return contextName;
	}

	/* depricated */
	async getSnapshotName (widgetName: string) {
		const snapshotName = await getSnapshotName(widgetName);
		return snapshotName;
	}

	/* depricated */
	async exportSheet (name: string, data: TableBuildData) {
		const sheet = await exportSheet(name, data);
		return sheet;
	}

	async exportWidgetAsSheet (widget: TableWidget, data: TableBuildData) {
		const snapshotName = await getSnapshotName(widget.name);
		const sheet = await exportSheet(snapshotName, data);
		return sheet;
	}

	async exportWidgetAsPDF (widget: Widget, save: boolean = false) {
		const container = this.getWidgetContainer(widget.id);

		if (container) {
			const name = await getSnapshotName(widget.name);
			const pdf = await exportPDF([container], name, save);
			return pdf;
		}

		return null;
	}

	async exportDashboardAsPDF (save: boolean = false) {
		const name = await createContextName();
		const containers = this.layout.map(this.getWidgetContainer.bind(this)).filter(Boolean);

		if (containers.length > 0) {
			const pdf = await exportPDF(containers, name, save);
			return pdf;
		}

		return null;
	}

	async exportWidgetAsPNG (widget: Widget, save: boolean = false) {
		const container = this.getWidgetContainer(widget.id);

		if (container) {
			const name = await getSnapshotName(widget.name);
			const png = await exportPNG(container, false, name, save);
			return png;
		}

		return null;
	}

	async exportDashboardAsPNG (container: HTMLDivElement, save: boolean = false) {
		const name = await createContextName();
		const png = await exportPNG(container, true, name, save);
		return png;
	}
}

export default new Exporter();

export {
	FILE_VARIANTS
};
