// @flow
import type {Breakdown, Indicator} from 'store/widgetForms/types';
import BreakdownFieldset from 'WidgetFormPanel/components/BreakdownFieldset';
import Checkbox from 'components/atoms/LegacyCheckbox';
import DataTopField from 'WidgetFormPanel/components/DataTopField';
import type {DataTopSettings} from 'store/widgets/data/types';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FormBox from 'components/molecules/FormBox';
import type {FormBoxProps} from 'WidgetFormPanel/components/IndicatorsBox/types';
import FormField from 'WidgetFormPanel/components/FormField';
import {getErrorPath} from 'WidgetFormPanel/helpers';
import IndicatorDataBox from 'WidgetFormPanel/components/IndicatorsBox';
import {isAllowedTopAggregation} from 'store/widgets/helpers';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';

export class ChartDataSetSettings extends PureComponent<Props> {
	static defaultProps = {
		components: {
			BreakdownFieldset,
			IndicatorsFormBox: FormBox
		}
	};

	handleChangeBreakdown = (breakdown: Breakdown) => {
		const {index, onChange, value} = this.props;

		onChange(index, {...value, breakdown});
	};

	handleChangeCheckbox = (name: string, value: boolean) => {
		const {index, onChange, value: dataSet} = this.props;

		onChange(index, {...dataSet, [name]: value});
	};

	handleChangeIndicators = (index: number, newIndicators: Array<Indicator>) => {
		const {index: dataSetIndex, onChange, value} = this.props;
		const {top} = value;
		let newValue = value;

		if (top.show && !isAllowedTopAggregation(newIndicators[0].aggregation)) {
			newValue = {
				...newValue,
				top: {
					...top,
					show: false
				}
			};
		}

		onChange(dataSetIndex, {...newValue, indicators: newIndicators});
	};

	handleChangeTopSettings = (top: DataTopSettings) => {
		const {index, onChange, value} = this.props;

		onChange(index, {...value, top});
	};

	handleRemoveBreakdown = () => {
		const {index, onChange, value} = this.props;

		onChange(index, {...value, breakdown: undefined});
	};

	renderBreakdownFieldSet = () => {
		const {components, index, requiredBreakdown, value} = this.props;
		const {breakdown, dataKey, indicators} = value;
		const {attribute} = indicators[0];

		return (
			<components.BreakdownFieldset
				dataKey={dataKey}
				index={index}
				indicator={attribute}
				key={index}
				onChange={this.handleChangeBreakdown}
				onRemove={this.handleRemoveBreakdown}
				removable={!requiredBreakdown}
				required={requiredBreakdown}
				value={breakdown}
			/>
		);
	};

	renderDataTopField = () => {
		const {index, value} = this.props;
		const {indicators, top} = value;
		const disabled = !isAllowedTopAggregation(indicators[0].aggregation);

		return (
			<FormField path={getErrorPath(DIAGRAM_FIELDS.data, index, DIAGRAM_FIELDS.top, DIAGRAM_FIELDS.count)}>
				<DataTopField disabled={disabled} onChange={this.handleChangeTopSettings} value={top} />
			</FormField>
		);
	};

	renderIndicatorsBox = () => {
		const {index, value} = this.props;
		const {dataKey, indicators, source} = value;

		return (
			<IndicatorDataBox
				components={{
					FormBox: this.renderIndicatorsFormBox
				}}
				dataKey={dataKey}
				index={index}
				onChange={this.handleChangeIndicators}
				source={source}
				value={indicators}
			/>
		);
	};

	renderIndicatorsFormBox = ({children, ...props}: FormBoxProps) => {
		const {components} = this.props;

		return (
			<components.IndicatorsFormBox {...props}>
				{children}
				{this.renderBreakdownFieldSet()}
				{this.renderDataTopField()}
			</components.IndicatorsFormBox>
		);
	};

	renderShowBlankDataCheckbox = () => {
		const {usesBlankData, value} = this.props;
		const {showBlankData} = value;

		if (usesBlankData) {
			return (
				<Checkbox
					className={styles.checkbox}
					label="Показывать незаполненные данные"
					name={DIAGRAM_FIELDS.showBlankData}
					onClick={this.handleChangeCheckbox}
					value={showBlankData}
				/>
			);
		}

		return null;
	};

	renderShowEmptyDataCheckbox = () => {
		const {usesEmptyData, value} = this.props;
		const {showEmptyData} = value;

		if (usesEmptyData) {
			return (
				<Checkbox
					className={styles.checkbox}
					label="Показывать нулевые значения"
					name={DIAGRAM_FIELDS.showEmptyData}
					onClick={this.handleChangeCheckbox}
					value={showEmptyData}
				/>
			);
		}

		return null;
	};

	render () {
		return (
			<Fragment>
				{this.renderIndicatorsBox()}
				{this.renderShowEmptyDataCheckbox()}
				{this.renderShowBlankDataCheckbox()}
			</Fragment>
		);
	}
}

export default ChartDataSetSettings;
