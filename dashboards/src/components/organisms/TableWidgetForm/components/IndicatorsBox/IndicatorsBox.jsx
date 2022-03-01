// @flow
import {DEFAULT_INDICATOR} from 'store/widgetForms/constants';
import FormBox from 'components/molecules/FormBox';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {Indicator} from 'store/widgets/data/types';
import IndicatorFieldset from 'WidgetFormPanel/components/IndicatorFieldset';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import SortableList from 'TableWidgetForm/components/SortableList';
import t from 'localization';

export class IndicatorsBox extends PureComponent<Props> {
	static defaultProps = {
		canAddIndicators: true,
		canCreateInterestRelative: false,
		components: {
			FormBox
		}
	};

	handleChange = (index: number, newIndicator: Indicator, callback?: Function) => {
		const {index: dataSetIndex, onChange, value} = this.props;
		const newValue = value.map((indicator, i) => i === index ? newIndicator : indicator);

		onChange(dataSetIndex, newValue, callback);
	};

	handleChangeOrder = (indicators: Array<Object>) => {
		const {index, onChange} = this.props;

		onChange(index, indicators);
	};

	handleClickAddButton = () => {
		const {index, onChange, value} = this.props;

		onChange(index, [...value, DEFAULT_INDICATOR]);
	};

	handleRemove = (index: number) => {
		const {index: dataSetIndex, onChange, value} = this.props;

		if (value.length > 1) {
			onChange(dataSetIndex, value.filter((indicators, i) => i !== index));
		}
	};

	renderFieldset = (indicator: Indicator, index: number, indicators: Array<Indicator>) => {
		const {canCreateInterestRelative, dataKey, index: dataSetIndex, source} = this.props;
		const removable = indicators.length > 1;

		return (
			<IndicatorFieldset
				dataKey={dataKey}
				dataSetIndex={dataSetIndex}
				hasInterestRelative={canCreateInterestRelative}
				index={index}
				key={index}
				onChange={this.handleChange}
				onRemove={this.handleRemove}
				removable={removable}
				source={source}
				usesNotApplicableAggregation={true}
				value={indicator}
			/>
		);
	};

	renderRightControl = () => {
		const {canAddIndicators} = this.props;

		if (canAddIndicators) {
			return (
				<IconButton
					icon={ICON_NAMES.PLUS}
					onClick={this.handleClickAddButton}
					round={false}
				/>
			);
		}

		return null;
	};

	render () {
		const {components, value} = this.props;

		return (
			<components.FormBox rightControl={this.renderRightControl()} title={t('TableWidgetForm::IndicatorsBox::Indicators')}>
				<SortableList
					list={value}
					onChangeOrder={this.handleChangeOrder}
					renderItem={this.renderFieldset}
				/>
			</components.FormBox>
		);
	}
}

export default IndicatorsBox;
