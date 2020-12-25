// @flow
import {DASHBOARD_HEADER_HEIGHT} from 'components/organisms/DashboardHeader/constants';
import {gridRef} from 'components/organisms/DashboardContent';
import {store} from 'index';

export class DashboardResizer {
	initHeight: number = window.innerHeight;

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

	isFullSize = () => {
		let isFullSize = true;

		if (window.parent) {
			const {innerHeight: parentHeight} = window.parent;
			const {innerHeight} = window;

			isFullSize = parentHeight >= innerHeight && innerHeight !== this.initHeight;
		}

		return isFullSize;
	};

	resetHeight = () => this.isFullSize() ? this.setHeight(window.innerHeight) : this.setHeight(this.initHeight);

	resize = () => {
		const {editMode: editableDashboard} = store.getState().dashboard.settings;

		if (this.isFullSize()) {
			this.resetHeight();
		} else if (editableDashboard) {
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

	setHeight = (height: number) => {
		const newHeight = `${height}px`;

		if (document.body && document.body.style.height !== newHeight) {
			document.body.style.height = newHeight;
		}
	};
}

export default DashboardResizer;
