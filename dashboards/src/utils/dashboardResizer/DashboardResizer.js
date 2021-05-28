// @flow
import {DASHBOARD_HEADER_HEIGHT} from 'components/organisms/DashboardHeader/constants';
import {gridRef} from 'components/organisms/WidgetsGrid/constants';
import type {Store} from 'store/types';

export class DashboardResizer {
	initHeight: number = window.innerHeight;
	store = null;

	constructor (store: Store) {
		this.store = store;
	}

	getContentHeight (): number | null {
		return gridRef.current && gridRef.current.getBoundingClientRect().height + DASHBOARD_HEADER_HEIGHT;
	}

	focus = () => window.frameElement.scrollIntoView();

	isEditableDashboard = () => {
		let editable = false;

		if (this.store) {
			const {dashboard, widgets} = this.store.getState();

			editable = dashboard.settings.editMode || widgets.data.selectedWidget;
		}

		return editable;
	};

	isFullSize = () => {
		let isFullSize = true;

		if (window.frameElement) {
			const {innerHeight: parentHeight} = window.parent;
			const {innerHeight} = window;

			isFullSize = parentHeight >= innerHeight && innerHeight !== this.initHeight;
		}

		return isFullSize;
	};

	resetHeight = () => this.isFullSize() ? this.setFullHeight() : this.setHeight(this.initHeight);

	resize = () => {
		if (this.isFullSize()) {
			this.setFullHeight();
		} else if (this.isEditableDashboard()) {
			this.setHeight(this.initHeight);
		} else {
			const height = this.getContentHeight();

			height && this.setHeight(height);
		}
	};

	setFullHeight = () => {
		if (document.body) {
			document.body.style.height = '100%';
			document.body.style.minHeight = `${this.initHeight}px`;
		}
	};

	setHeight = (height: number) => {
		const attrHeight = `${height}px`;

		if (document.body && document.body.style.height !== height) {
			document.body.style.height = attrHeight;
			document.body.style.minHeight = '';
		}
	};
}

export default DashboardResizer;
