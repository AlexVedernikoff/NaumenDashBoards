// @flow
import type {IPluralization} from 'localization/interfaces';

class Pluralization implements IPluralization {
	numberFormat = new Intl.NumberFormat('de');
	dateFormat = new Intl.DateTimeFormat('de');

	date (val: Date) {
		return this.dateFormat.format(val);
	}

	number (val: number) {
		return this.numberFormat.format(val);
	}

	numberAdditional () {
		return ['%', '€', '$'];
	}

	axiosLocales () {
		return {
			name: 'de',
			options: {
				days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
				months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
				shortDays: ['Son', 'Mon', 'Die', 'Mit', 'Don', 'Fre', 'Sam'],
				shortMonths: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
				toolbar: {
					download: 'SVG herunterladen',
					pan: 'Schwenken',
					reset: 'Zurücksetzen',
					selectionZoom: 'Auswahl vergrößern',
					zoomIn: 'Vergrößern',
					zoomOut: 'Verkleinern'
				}
			}
		};
	}
}

const pluralization = new Pluralization();

export default pluralization;
