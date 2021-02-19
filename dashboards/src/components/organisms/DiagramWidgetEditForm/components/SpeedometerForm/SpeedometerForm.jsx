// @flow
import {array, number, object} from 'yup';
import {DEFAULT_SPEEDOMETER_SETTINGS} from 'components/organisms/Speedometer/constants';
import {extend} from 'helpers';
import {FIELDS} from 'components/organisms/DiagramWidgetEditForm';
import type {FilledDataSet} from 'containers/DiagramWidgetEditForm/types';
import {getErrorMessage, mixed, rules} from 'components/organisms/DiagramWidgetEditForm/schema';
import {ParamsTab, StyleTab} from './components';
import type {ParamsTabProps, StyleTabProps, TypedFormProps} from 'DiagramWidgetEditForm/types';
import React, {Component} from 'react';
import type {SpeedometerData, SpeedometerWidget, Widget} from 'store/widgets/data/types';
import type {Values} from 'containers/WidgetEditForm/types';

export class SpeedometerForm extends Component<TypedFormProps> {
	getSchema = () => {
		const {base, requiredByCompute} = rules;
		const borderRequiredMessage = 'В поле границы шкал необходимо указать число';

		return object({
			...base,
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
				indicators: requiredByCompute(array(mixed().requiredAttribute(getErrorMessage(FIELDS.indicator)))),
				source: mixed().source()
			})),
			sources: mixed().minSourceNumbers().sourceNumbers()
		});
	};

	normalizeDataSet = (dataSet: FilledDataSet): SpeedometerData => {
		const {dataKey, indicators, source, sourceForCompute} = dataSet;

		return {
			dataKey,
			indicators,
			source,
			sourceForCompute
		};
	};

	updateWidget = (widget: Widget, values: Values): SpeedometerWidget => {
		const {id} = widget;
		const {
			borders,
			computedAttrs,
			data,
			displayMode,
			header,
			indicator,
			name = '',
			navigation,
			ranges,
			templateName,
			type
		} = values;

		return {
			borders,
			computedAttrs,
			data: data.map(this.normalizeDataSet),
			displayMode,
			header,
			id,
			indicator: extend(DEFAULT_SPEEDOMETER_SETTINGS.indicator, indicator),
			name,
			navigation,
			ranges: extend(DEFAULT_SPEEDOMETER_SETTINGS.ranges, ranges),
			templateName,
			type
		};
	};

	renderParamsTab = (props: ParamsTabProps) => <ParamsTab {...props} />;

	renderStyleTab = (props: StyleTabProps) => <StyleTab {...props} />;

	render () {
		return this.props.render({
			renderParamsTab: this.renderParamsTab,
			renderStyleTab: this.renderStyleTab,
			schema: this.getSchema(),
			updateWidget: this.updateWidget
		});
	}
}

export default SpeedometerForm;
