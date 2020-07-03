// @flow
import {array, object} from 'yup';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {DEFAULT_SPEEDOMETER_SETTINGS} from 'components/organisms/Speedometer/constants';
import {extend} from 'src/helpers';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {getErrorMessage, rules} from 'components/organisms/WidgetFormPanel/schema';
import {INTEGER_AGGREGATION} from 'store/widgets/constants';
import {normalizeDataSet} from 'utils/normalizer/widget/summaryNormalizer';
import {ParamsTab, StyleTab} from './components';
import type {ParamsTabProps, StyleTabProps, TypedFormProps} from 'WidgetFormPanel/types';
import React, {Component} from 'react';
import type {SpeedometerWidget, Widget} from 'store/widgets/data/types';
import type {Values} from 'containers/WidgetFormPanel/types';

export class SpeedometerForm extends Component<TypedFormProps> {
	getSchema = () => {
		const {base, requiredByCompute} = rules;
		const {borders, indicator, source} = FIELDS;

		return object({
			...base,
			data: array().of(object({
				[indicator]: requiredByCompute(indicator).when(FIELDS.aggregation, {
					is: aggregation => aggregation in INTEGER_AGGREGATION,
					then: object().test(
						'valid-attribute',
						'Выбранный показатель не может быть использован с агрегациями [AVG, MAX, MIN, SUM] на текущем типе виджета',
						indicator => !indicator || indicator.type !== ATTRIBUTE_TYPES.dtInterval
					)
				}),
				[source]: object().required(getErrorMessage(source)).nullable()
			})),
			[borders]: object().test(
				'compared-borders',
				'Значение min должно быть меньше max',
				borders => borders && (Number(borders.min) < Number(borders.max))
			).test(
				'required-borders',
				'Укажите границы шкал',
				borders => borders && Number.isInteger(parseInt(borders.min)) && Number.isInteger(parseInt(borders.max))
			)
		});
	};

	updateWidget = (widget: Widget, values: Values): SpeedometerWidget => {
		const {id, layout} = widget;
		const {
			borders,
			computedAttrs = [],
			data = [],
			header,
			name = '',
			ranges,
			type
		} = values;

		return {
			borders,
			computedAttrs,
			data: data.map(normalizeDataSet),
			header,
			id,
			layout,
			name,
			ranges: extend(DEFAULT_SPEEDOMETER_SETTINGS.ranges, ranges),
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
