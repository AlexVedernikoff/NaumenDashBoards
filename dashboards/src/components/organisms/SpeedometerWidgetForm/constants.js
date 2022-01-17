// @flow
import {addMethod, number} from 'yup';
import {array, baseSchema, mixed, object} from 'containers/DiagramWidgetForm/schema';
import type {Border} from 'src/store/widgets/data/types';
import t from 'localization';

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
				then: mixed().requiredAttribute(t('SpeedometerWidgetForm::RequiredAttributeMessage')).typeError(t('SpeedometerWidgetForm::RequiredAttributeMessage'))
			}),
		value: number().when(
			'isNumber', {
				is: true,
				then: number().required(t('SpeedometerWidgetForm::ValueRequiredMessage')).typeError(t('SpeedometerWidgetForm::ValueRequiredMessage'))
			})
	});
});

addMethod(object, 'borders', function () {
	return object({
		max: object().bordersMinMax().test(
			'check-border-min-max',
			t('SpeedometerWidgetForm::MinMaxMessage'),
			checkBorderMinMax
		).typeError(t('SpeedometerWidgetForm::RequiredMessage')),
		min: object().bordersMinMax().typeError(t('SpeedometerWidgetForm::RequiredMessage'))
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
