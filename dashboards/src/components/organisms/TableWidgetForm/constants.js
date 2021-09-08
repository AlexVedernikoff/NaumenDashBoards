// @flow
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

const schema = object({
	...baseSchema,
	data: array().of(object({
		breakdown: mixed().requiredByCompute(array().conditionalBreakdown()),
		indicators: mixed().requiredByCompute(array().indicators()),
		parameters: array().parameters(),
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
