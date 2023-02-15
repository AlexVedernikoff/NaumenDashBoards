// @flow
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FormBox from 'components/molecules/FormBox';
import {getDefaultFormatForIndicator} from 'store/widgets/data/helpers';
import type {Indicator} from 'store/widgetForms/types';
import IndicatorFieldset from 'WidgetFormPanel/components/IndicatorFieldset';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import t from 'localization';

export class IndicatorsBox extends PureComponent<Props> {
	static defaultProps = {
		components: {
			FormBox
		}
	};

	handleChange = (index: number, newIndicator: Indicator, callback?: Function) => {
		const {index: dataSetIndex, onChange, onResetIndicatorFormat, value} = this.props;
		let changeIndicatorFormat = null;
		const newIndicators = value.map((indicator, i) => {
			let result = indicator;

			if (i === index) {
				const newIndicatorFormat = getDefaultFormatForIndicator(newIndicator);
				const oldIndicatorsFormat = getDefaultFormatForIndicator(indicator);

				if (newIndicatorFormat.type === oldIndicatorsFormat.type) {
					result = newIndicator;
				} else {
					changeIndicatorFormat = newIndicatorFormat;
					result = {
						...newIndicator,
						format: newIndicatorFormat
					};
				}
			}

			return result;
		});

		onChange(dataSetIndex, newIndicators, callback);

		if (changeIndicatorFormat && onResetIndicatorFormat) {
			onResetIndicatorFormat(dataSetIndex, changeIndicatorFormat);
		}
	};

	renderIndicatorFieldSet = (indicator: Indicator, indicatorIndex: number) => {
		const {dataKey, index, source} = this.props;

		return (
			<IndicatorFieldset
				dataKey={dataKey}
				dataSetIndex={index}
				index={indicatorIndex}
				key={indicatorIndex}
				name={DIAGRAM_FIELDS.indicators}
				onChange={this.handleChange}
				source={source}
				value={indicator}
			/>
		);
	};

	render () {
		const {components, value} = this.props;

		return (
			<components.FormBox title={t('IndicatorsBox::Indicator')}>
				{value.map(this.renderIndicatorFieldSet)}
			</components.FormBox>
		);
	}
}

export default IndicatorsBox;
