// @flow
import type {IPluralization} from 'localization/interfaces';

class Pluralization implements IPluralization {
	numberFormat = new Intl.NumberFormat('pl');
	dateFormat = new Intl.DateTimeFormat('pl');

	date (val: Date) {
		return this.dateFormat.format(val);
	}

	number (val: number) {
		return this.numberFormat.format(val);
	}

	numberAdditional () {
		return ['%', 'zł', '€', '$'];
	}

	axiosLocales () {
		return {
			name: 'pl',
			options: {
				days: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'],
				months: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
				shortDays: ['Ni', 'Po', 'Wt', 'Śr', 'Cz', 'Pi', 'So'],
				shortMonths: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
				toolbar: {
					download: 'Pobierz SVG',
					pan: 'Pan',
					reset: 'Resetuj',
					selectionZoom: 'Powiększenie zaznaczenia',
					zoomIn: 'Powiększ',
					zoomOut: 'Pomniejszanie'
				}
			}
		};
	}
}

const pluralization = new Pluralization();

export default pluralization;
