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
}

const pluralization = new Pluralization();

export default pluralization;
