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

	formatMSInterval (data, params) {
		const INTERVALS = [
			['WEEK', 'нед'],
			['DAY', 'д'],
			['HOURS', 'ч'],
			['MINUTES', 'мин'],
			['SECONDS', 'с']
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
