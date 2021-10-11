// @flow
import {addMethod} from 'yup';
import {array, baseSchema, mixed, object} from 'containers/DiagramWidgetForm/schema';
import {checkSourceForParent} from './helpers';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';

const defaultValue = 'defaultValue';
const indicatorSettings = 'indicatorSettings';
const pageSize = 'pageSize';
const parameterSettings = 'parameterSettings';
const showRowNum = 'showRowNum';
const table = 'table';

const TABLE_FIELDS = {
	...DIAGRAM_FIELDS,
	defaultValue,
	indicatorSettings,
	pageSize,
	parameterSettings,
	showRowNum,
	table
};

addMethod(mixed, 'singleAttributeUse', function () {
	return this.test(
		'check-single-attribute-use',
		'Нельзя выбрать один и тот же атрибут дважды',
		function () {
			const {originalValue, values} = this.options;
			const {attribute: targetAttribute} = originalValue;
			let result = false;

			if (targetAttribute) {
				const {code: targetCode, sourceCode: targetSourceCode} = targetAttribute;

				const checkMatchToTargetAttribute = ({attribute}) => {
					let checkerResult = false;

					if (attribute && attribute !== targetAttribute) {
						const {code, sourceCode} = attribute;

						checkerResult = code === targetCode && sourceCode === targetSourceCode;
					}

					return checkerResult;
				};

				result = !values.data.some(({breakdown, indicators, parameters, sourceForCompute}) =>
					!sourceForCompute && (
						(parameters?.some(checkMatchToTargetAttribute) ?? false)
						|| (indicators?.some(checkMatchToTargetAttribute) ?? false)
						|| (breakdown?.some(checkMatchToTargetAttribute) ?? false)
					)
				);
			}

			return result;
		}
	);
});

const schema = object({
	...baseSchema,
	data: array().of(object({
		breakdown: mixed().requiredByCompute(array().conditionalBreakdown()),
		indicators: mixed().requiredByCompute(array().indicators().of(mixed().singleAttributeUse())),
		parameters: array().parameters().of(mixed().singleAttributeUse()),
		source: object().source().test(
			'check-source-for-parent',
			'Для данного типа выбранный источник не доступен - выберите другой',
			checkSourceForParent
		)
	})),
	sources: mixed().minSourceNumbers(),
	top: object().topSettings()
});

export {
	schema,
	TABLE_FIELDS
};
