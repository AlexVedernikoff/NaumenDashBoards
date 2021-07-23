// @flow
import {DASHBOARD_HEADER_HEIGHT} from 'components/organisms/DashboardHeader/constants';
import {gridRef} from 'components/organisms/WidgetsGrid/constants';
import type {Store} from 'store/types';

export class DashboardResizer {
	initHeight: number = window.innerHeight;
	sizeWillBeChanged = false;
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

	listenerCallback = (callback: Function) => window.addEventListener('resize', () => {
		callback();
		this.sizeWillBeChanged = false;
	}, {once: true});

	resetHeight = () => this.isFullSize() ? this.setFullHeight() : this.setCustomHeight(this.initHeight);

	resize = (callback?: Function) => {
		if (this.isFullSize()) {
			this.setFullHeight();
		} else if (this.isEditableDashboard()) {
			this.setCustomHeight(this.initHeight);
		} else {
			const height = this.getContentHeight();

			height && this.setCustomHeight(height);
		}

		if (callback) {
			this.sizeWillBeChanged ? this.listenerCallback(callback) : callback();
		}
	};

	setCustomHeight = (height: number) => this.setHeight(`${height}px`, '');

	setFullHeight = () => this.setHeight('100%', `${this.initHeight}px`);

	setHeight = (height: string, minHeight: string) => {
		if (document.body && document.body.style.height !== height) {
			document.body.style.height = height;
			document.body.style.minHeight = minHeight;

			this.sizeWillBeChanged = true;
		}
	};
}

export default DashboardResizer;
