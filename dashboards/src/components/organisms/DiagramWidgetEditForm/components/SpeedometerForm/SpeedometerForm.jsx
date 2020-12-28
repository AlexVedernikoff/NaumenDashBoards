// @flow
import {array, number, object} from 'yup';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {DEFAULT_SPEEDOMETER_SETTINGS} from 'components/organisms/Speedometer/constants';
import {extend} from 'src/helpers';
import {FIELDS} from 'components/organisms/DiagramWidgetEditForm';
import {getErrorMessage, mixed, rules} from 'components/organisms/DiagramWidgetEditForm/schema';
import {navigationSettings} from 'utils/normalizer/widget/helpers';
import {normalizeDataSet} from 'utils/normalizer/widget/summaryNormalizer';
import {ParamsTab, StyleTab} from './components';
import type {ParamsTabProps, StyleTabProps, TypedFormProps} from 'DiagramWidgetEditForm/types';
import React, {Component} from 'react';
import type {SpeedometerWidget, Widget} from 'store/widgets/data/types';
import type {Values} from 'containers/WidgetEditForm/types';

export class SpeedometerForm extends Component<TypedFormProps> {
	getSchema = () => {
		const {base, requiredByCompute} = rules;
		const {borders, indicator, source, sources} = FIELDS;
		const borderRequiredMessage = 'В поле границы шкал необходимо указать число';

		return object({
			...base,
			[borders]: object({
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
				[indicator]: requiredByCompute(indicator).test(
					'valid-attribute',
					'Выбранный показатель не может быть использован на текущем типе виджета',
					indicator => !indicator || indicator.type !== ATTRIBUTE_TYPES.dtInterval
				),
				[source]: object().required(getErrorMessage(source)).nullable()
			})),
			[sources]: mixed().minSourceNumbers().sourceNumbers()
		});
	};

	updateWidget = (widget: Widget, values: Values): SpeedometerWidget => {
		const {id} = widget;
		const {
			borders,
			computedAttrs = [],
			data = [],
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
			data: data.map(normalizeDataSet),
			displayMode,
			header,
			id,
			indicator: extend(DEFAULT_SPEEDOMETER_SETTINGS.indicator, indicator),
			name,
			navigation: navigationSettings(navigation),
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
