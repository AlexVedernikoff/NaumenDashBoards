// @flow
import type {IPluralization} from 'localization/interfaces';

class Pluralization implements IPluralization {
	numberFormat = new Intl.NumberFormat('ru');
	dateFormat = new Intl.DateTimeFormat('ru');

	date (val: Date) {
		return this.dateFormat.format(val);
	}

	number (val: number) {
		return this.numberFormat.format(val);
	}

	numberAdditional () {
		return ['%', 'руб.', '$', '€'];
	}

	customRange (data: {end: Date, start: Date}) {
		return `за ${this.date(data.start)}-${this.date(data.end)}`;
	}
}

const pluralization = new Pluralization();

export default pluralization;
