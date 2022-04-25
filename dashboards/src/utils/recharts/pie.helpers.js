// @flow
import type {DiagramBuildData} from 'store/widgets/buildData/types';

/**
 * Возвращает функцию для расчета общего количества данных на круговой диаграмме
 * @param {DiagramBuildData} data - данные конкретного графика
 * @returns {() => number}
 */
const getPieTotalCalculator = (data: DiagramBuildData) => (): number => {
	let result = 0;

	data.series.forEach(item => {
		if (typeof item === 'number') {
			result += item;
		} else if (typeof item === 'string') {
			const itemValue = Number.parseFloat(item);

			if (!isNaN(itemValue)) {
				result += itemValue;
			}
		}
	});

	return result;
};

export {
	getPieTotalCalculator
};
