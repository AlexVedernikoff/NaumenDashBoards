// @flow
import {DASHBOARD_HEADER_HEIGHT} from 'components/organisms/DashboardHeader/constants';
import {gridRef} from 'components/organisms/DashboardContent';
import {store} from 'index';

export class DashboardResizer {
	initHeight: number = window.innerHeight;

	getContentHeight = () => gridRef.current && gridRef.current.getBoundingClientRect().height + DASHBOARD_HEADER_HEIGHT;

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

	setHeight = (height: number) => {
		const newHeight = `${height}px`;

		if (document.body && document.body.style.height !== newHeight) {
			document.body.style.height = newHeight;
		}
	};
}

export default DashboardResizer;
