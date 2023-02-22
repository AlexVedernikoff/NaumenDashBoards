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

	customRange (data: {end: Date, start: Date}) {
		return `w okresie od ${this.date(data.start)} do ${this.date(data.end)}`;
	}

	formatMSInterval (data, params) {
		const INTERVALS = [
			['WEEK', 't'],
			['DAY', 'd'],
			['HOURS', 'g'],
			['MINUTES', 'p'],
			['SECONDS', 's']
		];

		const translation = [];

		INTERVALS.forEach(([key, label]) => {
			if (key in params) {
				translation.push(`${params[key]}${label}`);
			}
		});

		return translation.join(' ');
	}
}

const pluralization = new Pluralization();

export default pluralization;
