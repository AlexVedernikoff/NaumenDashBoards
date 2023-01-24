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

	customRange (data: {end: Date, start: Date}) {
		return `für ${this.date(data.start)}-${this.date(data.end)}`;
	}
}

const pluralization = new Pluralization();

export default pluralization;
