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
			const {innerHeight: parentHeight, innerWidth: parentWidth} = window.parent;
			const {innerHeight, innerWidth} = window;

			isFullSize = parentHeight === innerHeight && parentWidth === innerWidth;
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

	scrollTo = (x: number, y: number) => {
		const {frameElement} = window;
		const scrollParent = this.getScrollParent(frameElement);

		if (scrollParent) {
			const parentOffset = scrollParent.getBoundingClientRect().top;
			const dashboardOffset = frameElement.getBoundingClientRect().top;

			setTimeout(() => scrollParent.scrollTo(x, y + dashboardOffset - parentOffset));
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
