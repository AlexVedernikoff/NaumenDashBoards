// @flow
import {ATTRIBUTES_HELPERS_CONTEXT} from 'containers/DiagramWidgetForm/HOCs/withAttributesHelpers';
import type {Breakdown} from 'store/widgetForms/types';
import BreakdownFieldset from 'WidgetFormPanel/components/BreakdownFieldset';
import {createPivotIndicator} from 'store/widgetForms/pivotForm/helpers';
import type {DataSet, PivotIndicator} from 'store/widgetForms/pivotForm/types';
import {DEFAULT_INDICATOR} from 'store/widgetForms/constants';
import FormBox from 'components/molecules/FormBox';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import IndicatorFieldset from 'WidgetFormPanel/components/IndicatorFieldset';
import type {IndicatorValue, Props, State} from './types';
import memoize from 'memoize-one';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import t from 'localization';

export class IndicatorsDataBox extends PureComponent<Props, State> {
	state = {
		values: []
	};

	getEmptyHelpers = memoize(() => ({
		filterAttributeByMainDataSet: (options, dataSetIndex) => options,
		filterAttributesByUsed: (options, dataSetIndex) => options,
		getCommonAttributes: () => []
	}));

	calculateValues = () => {
		const {data} = this.props;
		const values = [];

		data.map((dataSet, dataSetIndex) => {
			const {dataKey, indicators} = dataSet;

			if (indicators) {
				dataSet.indicators.map((indicator, index) => {
					values.push({dataKey, dataSetIndex, index, indicator});
				});
			}
		});

		this.setState({values});
	};

	compareDataKeys = (data: Array<DataSet>, prevData: Array<DataSet>) => {
		let result = true;

		if (data.length !== prevData.length) {
			result = false;
		} else {
			const dataKeysSets = new Set(data.map(({dataKey}) => dataKey));
			const prevDataKeysSets = new Set(prevData.map(({dataKey}) => dataKey));
			const hasAll = [...dataKeysSets, ...prevDataKeysSets].every(
				value => dataKeysSets.has(value) && prevDataKeysSets.has(value)
			);

			result = hasAll;
		}

		return result;
	};

	componentDidMount () {
		this.calculateValues();
	}

	componentDidUpdate (prevProps: Props) {
		const {data} = this.props;

		if (!this.compareDataKeys(data, prevProps.data)) {
			this.calculateValues();
		}
	}

	getChangeBreakdownHandler = (valueIndex: number) => (breakdowns: Breakdown) => {
		const {values} = this.state;

		if (breakdowns.length > 0) {
			const breakdown = breakdowns[0];
			const newValues = values.map((item, idx) => {
				const result = {...item};

				if ((idx === valueIndex)) {
					const {indicator} = item;
					const newIndicator = {...indicator, breakdown};

					result.indicator = newIndicator;
				}

				return result;
			});

			this.setState({values: newValues}, this.updateData);
		}
	};

	getChangeDataSetIndicatorHandler = (valueIndex: number) => (index: number, dataSetIndex: number) => {
		const {data} = this.props;
		const {values} = this.state;
		const {dataKey} = data[dataSetIndex];

		const newValues = values.map((item, idx) =>
			(idx === valueIndex)
				? {...item, dataKey, dataSetIndex, indicator: createPivotIndicator()}
				: item
		);

		this.setState({values: newValues}, this.updateData);
	};

	getChangeIndicatorHandler = (dataSetIndex: number) => (index: number, indicator: PivotIndicator) => {
		const {values} = this.state;
		const newValues = values.map(item =>
			(item.dataSetIndex === dataSetIndex && item.index === index)
				? {...item, indicator}
				: item
		);

		this.setState({values: newValues}, this.updateData);
	};

	getClearBreakdownHandler = (valueIndex: number) => () => {
		const {values} = this.state;
		const newValues = values.map((item, idx) => {
			const result = {...item};

			if ((idx === valueIndex)) {
				const {indicator} = item;
				const {breakdown, ...newIndicator} = indicator;

				result.indicator = newIndicator;
			}

			return result;
		});

		this.setState({values: newValues}, this.updateData);
	};

	getRemoveIndicatorHandler = (valueIndex: number) => () => {
		const {values} = this.state;
		const newValues = values.filter((_, idx) => valueIndex !== idx);

		this.setState({values: newValues}, this.updateData);
	};

	handleClickAddButton = () => {
		const {data} = this.props;
		const {values} = this.state;

		if (data.length > 0) {
			const {dataKey} = data[0];
			const index = values.filter(item => item.dataKey === dataKey).length;
			const newValues = [
				...values,
				{dataKey, dataSetIndex: 0, index, indicator: createPivotIndicator()}
			];

			this.setState({values: newValues});
		}
	};

	updateData = () => {
		const {data, onChange} = this.props;
		const {values} = this.state;

		if (onChange) {
			const newData = data.map(dataSet => ({...dataSet, indicators: []}));

			values.forEach(item => {
				if (item.indicator?.attribute) {
					newData[item.dataSetIndex].indicators.push(item.indicator);
				}
			});

			onChange(newData);
		}
	};

	renderBreakdown = (indicatorValue: IndicatorValue, valueIndex: number) => {
		const {dataKey, dataSetIndex, indicator} = indicatorValue;
		const {attribute, breakdown} = indicator;

		if (attribute) {
			const value = breakdown ? [breakdown] : [];

			return (
				<BreakdownFieldset
					dataKey={dataKey}
					index={dataSetIndex}
					indicator={attribute}
					onChange={this.getChangeBreakdownHandler(valueIndex)}
					onRemove={this.getClearBreakdownHandler(valueIndex)}
					onlyCommonAttributes={true}
					removable={true}
					value={value}
				/>
			);
		}

		return null;
	};

	renderIndicator = (indicatorValue: IndicatorValue, valueIndex: number) => (
		<div className={styles.indicator} key={valueIndex}>
			{this.renderIndicatorValue(indicatorValue, valueIndex)}
			{this.renderBreakdown(indicatorValue, valueIndex)}
		</div>
	);

	renderIndicatorValue = (indicatorValue: IndicatorValue, valueIndex: number) => {
		const {data} = this.props;
		const {dataKey, dataSetIndex, index, indicator} = indicatorValue;
		const source = data.find(dataSet => dataSet.dataKey === dataKey)?.source;

		if (source) {
			return (
				<ATTRIBUTES_HELPERS_CONTEXT.Provider value={this.getEmptyHelpers()}>
					<IndicatorFieldset
						dataKey={dataKey}
						dataSetIndex={dataSetIndex}
						dataSets={data}
						filteredSource={source}
						index={index}
						onChange={this.getChangeIndicatorHandler(dataSetIndex)}
						onChangeDataSet={this.getChangeDataSetIndicatorHandler(valueIndex)}
						onRemove={this.getRemoveIndicatorHandler(valueIndex)}
						removable={true}
						source={source}
						value={indicator ?? DEFAULT_INDICATOR}
					/>
				</ATTRIBUTES_HELPERS_CONTEXT.Provider>
			);
		}

		return null;
	};

	renderRightControl = () => <IconButton icon={ICON_NAMES.PLUS} onClick={this.handleClickAddButton} round={false} />;

	render () {
		const {values} = this.state;
		return (
			<FormBox rightControl={this.renderRightControl()} title={t('PivotWidgetForm::Indicators')}>
				{values.map(this.renderIndicator)}
			</FormBox>
		);
	}
}

export default IndicatorsDataBox;
