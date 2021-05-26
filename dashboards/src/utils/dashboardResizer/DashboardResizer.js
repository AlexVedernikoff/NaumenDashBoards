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

	getScrollParent = (node?: HTMLElement | null): HTMLElement | null => {
		let parentNode = null;

		if (node) {
			const {clientHeight, scrollHeight} = node;

			// $FlowFixMe
			parentNode = scrollHeight > clientHeight ? node : this.getScrollParent(node.parentNode);
		}

		return parentNode;
	};

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

	/**
	 * Функция для обхода проблемы, когда высота прокрутки родительского элемента не успевает увеличиваться
	 * относительно содержимого
	 * @param {number} x - значение по горизонтали
	 * @param {number} y - значение по вертикали
	 * @param {HTMLElement} parent - родительский элемент
	 * @param {number} attemptCount - количество попыток применить текущую функцию
	 */
	scrollByValidParentScrollHeight = (x: number, y: number, parent: HTMLElement, attemptCount: number = 0) => {
		if (parent.scrollHeight >= y) {
			parent.scrollTo && parent.scrollTo(x, y);
		} else if (attemptCount < 5) {
			setTimeout(() => this.scrollByValidParentScrollHeight(x, y, parent), 1000, attemptCount + 1);
		}
	};

	scrollTo = (x: number, y: number) => {
		const {frameElement} = window;
		const scrollParent = this.getScrollParent(frameElement);

		if (scrollParent && !this.isFullSize()) {
			const parentOffset = scrollParent.getBoundingClientRect().top;
			const dashboardOffset = frameElement.getBoundingClientRect().top;
			const totalY = y + dashboardOffset - parentOffset + scrollParent.scrollTop;

			this.scrollByValidParentScrollHeight(x, totalY, scrollParent);
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
