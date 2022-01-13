// @flow
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FormBox from 'components/molecules/FormBox';
import type {Indicator} from 'store/widgetForms/types';
import IndicatorFieldset from 'WidgetFormPanel/components/IndicatorFieldset';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class IndicatorsBox extends PureComponent<Props> {
	static defaultProps = {
		components: {
			FormBox
		}
	};

	handleChange = (index: number, newIndicator: Indicator, callback?: Function) => {
		const {index: dataSetIndex, onChange, value} = this.props;
		const newIndicators = value.map((indicator, i) => i === index ? newIndicator : indicator);

		onChange(dataSetIndex, newIndicators, callback);
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
			<components.FormBox title="Показатель">
				{value.map(this.renderIndicatorFieldSet)}
			</components.FormBox>
		);
	}
}

export default IndicatorsBox;
