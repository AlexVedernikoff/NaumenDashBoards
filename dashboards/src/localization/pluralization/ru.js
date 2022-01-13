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

	axiosLocales () {
		return {
			name: 'ru',
			options: {
				days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
				months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
				shortDays: ['Вос', 'Пон', 'Вт', 'Ср', 'Чет', 'Пят', 'Сб'],
				shortMonths: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноб', 'Дек'],
				toolbar: {
					download: 'Download SVG',
					pan: 'Перемещение по оси',
					reset: 'Масштаб по умолчанию',
					selectionZoom: 'Выделение области',
					zoomIn: 'Увеличить',
					zoomOut: 'Уменьшить'
				}
			}
		};
	}
}

const pluralization = new Pluralization();

export default pluralization;
