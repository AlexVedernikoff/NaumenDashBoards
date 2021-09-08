// @flow
import {array, baseSchema, mixed, object} from 'containers/DiagramWidgetForm/schema';
import {number} from 'yup';

const borderRequiredMessage = 'В поле границы шкал необходимо указать число';

const schema = object({
	...baseSchema,
	borders: object({
		max: number().test(
			'check-border-max',
			'значение в поле max не может быть меньше значения в поле min',
			function (value: string) {
				const {min} = this.options.parent;

				return isNaN(parseFloat(min)) || Number(value) > Number(min);
			}
		).required(borderRequiredMessage).typeError(borderRequiredMessage),
		min: number().test(
			'check-border-min',
			'значение в поле min не может превышать значение в поле max',
			function (value: string) {
				const {max} = this.options.parent;

				return isNaN(parseFloat(max)) || Number(value) < Number(max);
			}
		).required(borderRequiredMessage).typeError(borderRequiredMessage)
	}).default({}),
	data: array().of(object({
		indicators: mixed().requiredByCompute(array().indicators()),
		source: object().source()
	})),
	sources: mixed().minSourceNumbers().sourceNumbers()
});

export {
	schema
};
