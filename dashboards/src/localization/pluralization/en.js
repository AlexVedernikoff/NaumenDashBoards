// @flow
import type {IPluralization} from 'localization/interfaces';

class Pluralization implements IPluralization {
	numberFormat = new Intl.NumberFormat('en');
	dateFormat = new Intl.DateTimeFormat('en');

	date (val: Date) {
		return this.dateFormat.format(val);
	}

	number (val: number) {
		return this.numberFormat.format(val);
	}

	numberAdditional () {
		return ['%', '$', '€'];
	}

	axiosLocales () {
		return {
			name: 'en',
			options: {
				days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
				months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Th', 'Fr', 'Sa'],
				shortMonths: ['Jan', 'Feb', 'Маr', 'Ape', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
				toolbar: {
					download: 'Download SVG',
					pan: 'Pan',
					reset: 'Reset',
					selectionZoom: 'Selection zoom',
					zoomIn: 'Zoom in',
					zoomOut: 'Zoom out'
				}
			}
		};
	}
}

const pluralization = new Pluralization();

export default pluralization;
