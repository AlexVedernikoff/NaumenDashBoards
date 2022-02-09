// @flow
import api from 'api';
import {DASHBOARD_HEADER_HEIGHT} from 'components/organisms/DashboardHeader/constants';
import {gridRef} from 'components/organisms/WidgetsGrid/constants';
import isMobile from 'ismobilejs';
import type {Store} from 'store/types';

export class DashboardResizer {
	initHeight: number = window.innerHeight;
	sizeWillBeChanged = false;
	store = null;
	isMobile = false;

	constructor (store: Store) {
		this.store = store;
		this.isMobile = isMobile().any;
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

	isFullSize = () => window.frameElement ? api.instance.frame.getViewMode() === 'fullScreen' : true;

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

	setFullHeight = () => {
		const {frameElement} = window;

		if (frameElement) {
			const clientHeight = frameElement.ownerDocument.documentElement.clientHeight;
			const {left, top} = frameElement.getBoundingClientRect();
			// left - padding топового блока
			// 8px - margin-top растяние элемента оболочки iframe
			const height = clientHeight - top - left - 8;

			this.setHeight(`${height}px`, `${this.initHeight}px`);
		} else {
			this.setHeight(`100%`, `${this.initHeight}px`);
		}
	};

	setHeight = (height: string, minHeight: string) => {
		if (document.body) {
			if (this.isMobile) {
				document.body.style.overflow = 'auto';
			} else if (document.body.style.height !== height) {
				this.sizeWillBeChanged = window.height < parseInt(height);

				document.body.style.height = height;
				document.body.style.minHeight = minHeight;
			}
		}
	};
}

export default DashboardResizer;
