// @flow
import {createContextName, getSnapshotName} from './helpers';
import exportSheet from './xlxs';
import {exportPDF} from './pdf';
import {exportPNG} from './core';
import {FILE_VARIANTS} from './constants';
import type {TableBuildData} from 'store/widgets/buildData/types';
import type {TableWidget, Widget} from 'store/widgets/data/types';
import type {WidgetStoreItem} from './types';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

class Exporter {
	store: {[id: string]: WidgetStoreItem};
	layout: Array<string>;

	constructor () {
		this.store = {};
		this.layout = [];
	}

	getWidgetContainer (widgetId: string): ?WidgetStoreItem {
		if (widgetId in this.store) {
			return this.store[widgetId];
		}

		return null;
	}

	registerWidgetContainer (widgetId: string, container: HTMLDivElement, type: $Keys<typeof WIDGET_TYPES>) {
		this.store[widgetId] = {container, type};
	}

	unregisterWidgetContainer (widgetId: string) {
		delete this.store[widgetId];
	}

	setLayout (layout: Array<string>) {
		this.layout = layout;
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
			const options = {name, toDownload: save};
			const pdf = await exportPDF([container], options);
			return pdf;
		}

		return null;
	}

	async exportDashboardAsPDF (save: boolean = false) {
		const name = await createContextName();
		const containers = this.layout.map(this.getWidgetContainer.bind(this)).filter(Boolean);

		if (containers.length > 0) {
			const options = {name, toDownload: save};
			const pdf = await exportPDF(containers, options);
			return pdf;
		}

		return null;
	}

	async exportWidgetAsPNG (widget: Widget, save: boolean = false) {
		const container = this.getWidgetContainer(widget.id);

		if (container) {
			const name = await getSnapshotName(widget.name);
			const options = {addBackgroundColor: false, name, toDownload: save};
			const png = await exportPNG(container.container, options);
			return png;
		}

		return null;
	}

	async exportDashboardAsPNG (container: HTMLDivElement, save: boolean = false) {
		const name = await createContextName();
		const options = {addBackgroundColor: true, name, toDownload: save};
		const png = await exportPNG(container, options);
		return png;
	}
}

export default new Exporter();

export {
	FILE_VARIANTS
};
