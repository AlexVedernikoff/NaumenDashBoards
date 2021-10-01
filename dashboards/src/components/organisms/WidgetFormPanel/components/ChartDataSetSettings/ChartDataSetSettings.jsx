// @flow
import type {Breakdown, Indicator} from 'store/widgetForms/types';
import Checkbox from 'components/atoms/Checkbox';
import DataTopField from 'WidgetFormPanel/components/DataTopField';
import type {DataTopSettings} from 'store/widgets/data/types';
import DefaultComponents from './defaultComponents';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import type {FormBoxProps} from 'WidgetFormPanel/components/IndicatorsBox/types';
import FormControl from 'components/molecules/FormControl';
import FormField from 'WidgetFormPanel/components/FormField';
import {getErrorPath} from 'WidgetFormPanel/helpers';
import IndicatorDataBox from 'WidgetFormPanel/components/IndicatorsBox';
import {isAllowedTopAggregation} from 'store/widgets/helpers';
import type {OnChangeEvent} from 'components/types';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';

export class ChartDataSetSettings extends PureComponent<Props> {
	static defaultProps = {
		components: DefaultComponents
	};

	handleChangeBreakdown = (breakdown: Breakdown) => {
		const {index, onChange, value} = this.props;

		onChange(index, {...value, breakdown});
	};

	handleChangeCheckbox = ({name, value}: OnChangeEvent<boolean>) => {
		const {index, onChange, value: dataSet} = this.props;
		return onChange(index, {...dataSet, [name]: !value});
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
				<FormField>
					<FormControl label="Показывать незаполненные данные">
						<Checkbox
							checked={showBlankData}
							className={styles.checkbox}
							name={DIAGRAM_FIELDS.showBlankData}
							onChange={this.handleChangeCheckbox}
							value={showBlankData}
						/>
					</FormControl>
				</FormField>
			);
		}

		return null;
	};

	renderShowEmptyDataCheckbox = () => {
		const {usesEmptyData, value} = this.props;
		const {showEmptyData} = value;

		if (usesEmptyData) {
			return (
				<FormField>
					<FormControl label="Показывать нулевые значения">
						<Checkbox
							checked={showEmptyData}
							className={styles.checkbox}
							name={DIAGRAM_FIELDS.showEmptyData}
							onChange={this.handleChangeCheckbox}
							value={showEmptyData}
						/>
					</FormControl>
				</FormField>
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
