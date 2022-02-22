// @flow
import api from 'api';
import {DASHBOARD_HEADER_HEIGHT} from 'components/organisms/DashboardHeader/constants';
import {DEFAULT_HEIGHT} from './constants';
import {gridRef} from 'components/organisms/WidgetsGrid/constants';
import isMobile from 'ismobilejs';
import type {Store} from 'store/types';

export class DashboardResizer {
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

	getFrameInitHeight (): number {
		let result = window.innerHeight ?? DEFAULT_HEIGHT;

		if (window.frameElement) {
			const attributeHeight = window.frameElement.getAttribute('height');

			result = Number.parseInt(attributeHeight);

			if (isNaN(result)) {
				result = DEFAULT_HEIGHT;
			}
		}

		return result;
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

	resetHeight = () => this.isFullSize() ? this.setFullHeight() : this.setCustomHeight(this.getFrameInitHeight());

	resize = (callback?: Function) => {
		if (this.isFullSize()) {
			this.setFullHeight();
		} else if (this.isEditableDashboard()) {
			this.setCustomHeight(this.getFrameInitHeight());
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
		const frameHeight = this.getFrameInitHeight();

		if (frameElement) {
			const clientHeight = frameElement.ownerDocument.documentElement.clientHeight;
			const {left, top} = frameElement.getBoundingClientRect();
			// left - padding топового блока
			// 8px - margin-top растяние элемента оболочки iframe
			const height = clientHeight - top - left - 8;

			this.setHeight(`${height}px`, `${frameHeight}px`);
		} else {
			this.setHeight(`100%`, `${frameHeight}px`);
		}
	};

	setHeight = (height: string, minHeight: string) => {
		const body = document.body;

		if (body) {
			if (this.isMobile) {
				body.style.overflow = 'auto';
			} else if (body.style.height !== height) {
				this.sizeWillBeChanged = window.height < parseInt(height);

				body.style.height = height;
				body.style.minHeight = minHeight;
			}
		}
	};
}

export default DashboardResizer;
