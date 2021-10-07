// @flow
import {addMethod, number} from 'yup';
import {array, baseSchema, mixed, object} from 'containers/DiagramWidgetForm/schema';
import type {Border} from 'src/store/widgets/data/types';

const borderRequiredMessage = 'В поле границы шкал необходимо указать либо число либо атрибут';
const borderValueRequiredMessage = 'В поле границы шкал необходимо указать число';
const borderRequiredAttributeMessage = 'В поле границы шкал необходимо указать атрибут';
const borderMinMaxMessage = 'Значение в поле min не может превышать значение в поле max';

/**
 * Проверяет числовые значения границ
 * @param {Border} max -значение
 * @returns {boolean} - результат проверки того, что минимальная граница меньше максимальной
 */
function checkBorderMinMax (max: Border) {
	const {parent: {min}} = this;
	let result = true;

	if (max.isNumber && min.isNumber && min.value >= max.value) {
		result = false;
	}

	return result;
}

addMethod(object, 'bordersMinMax', function () {
	return object({
		indicator: mixed().when(
			'isNumber', {
				is: false,
				then: mixed().requiredAttribute(borderRequiredAttributeMessage).typeError(borderRequiredAttributeMessage)
			}),
		value: number().when(
			'isNumber', {
				is: true,
				then: number().required(borderValueRequiredMessage).typeError(borderValueRequiredMessage)
			})
	});
});

addMethod(object, 'borders', function () {
	return object({
		max: object().bordersMinMax().test(
			'check-border-min-max',
			borderMinMaxMessage,
			checkBorderMinMax
		).typeError(borderRequiredMessage),
		min: object().bordersMinMax().typeError(borderRequiredMessage)
	});
});

const schema = object({
	...baseSchema,
	borders: object().borders().default({}),
	data: array().of(object({
		indicators: mixed().requiredByCompute(array().indicators()),
		source: object().source()
	})),
	sources: mixed().minSourceNumbers().sourceNumbers()
});

export {
	schema
};
