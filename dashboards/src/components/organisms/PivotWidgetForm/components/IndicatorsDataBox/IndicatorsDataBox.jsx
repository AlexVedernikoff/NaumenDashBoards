// @flow
import {ATTRIBUTES_HELPERS_CONTEXT} from 'containers/DiagramWidgetForm/HOCs/withAttributesHelpers';
import type {Breakdown} from 'store/widgetForms/types';
import BreakdownFieldset from 'WidgetFormPanel/components/BreakdownFieldset';
import {createPivotIndicator} from 'store/widgetForms/pivotForm/helpers';
import {DEFAULT_INDICATOR} from 'store/widgetForms/constants';
import FormBox from 'components/molecules/FormBox';
import {getDataKeysWithChangedDataSourceValue, hasDisableTotal, isDataKeysChanged} from './helpers';
import {getSourceAttribute} from 'store/sources/attributes/helpers';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import IndicatorFieldset from 'WidgetFormPanel/components/IndicatorFieldset';
import type {IndicatorValue, Props, State} from './types';
import memoize from 'memoize-one';
import type {PivotIndicator} from 'store/widgetForms/pivotForm/types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import t from 'localization';

export class IndicatorsDataBox extends PureComponent<Props, State> {
	constructor (props) {
		super();
		this.state = {
			disableTotalSum: hasDisableTotal(props.data ?? []),
			values: []
		};
	}

	getEmptyHelpers = memoize(() => ({
		filterAttributeByMainDataSet: (options, dataSetIndex) => options,
		filterAttributesByUsed: (options, dataSetIndex) => options,
		getCommonAttributes: () => []
	}));

	componentDidMount () {
		this.calculateValues();
	}

	async componentDidUpdate (prevProps: Props) {
		const {data} = this.props;

		if (!isDataKeysChanged(data, prevProps.data)) {
			await this.calculateValues();
		}

		const changedSources = getDataKeysWithChangedDataSourceValue(data, prevProps.data);

		if (changedSources.length > 0) {
			await this.fetchValuesAttributes(changedSources);
		}

		if (prevProps.data === data) {
			this.checkDisableTotalSum();
		} else {
			const disableTotalSum = hasDisableTotal(data);

			this.setState({disableTotalSum}, this.checkDisableTotalSum);
		}
	}

	calculateValues = async () => new Promise(resolve => {
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

		this.setState({values}, resolve);
	});

	checkDisableTotalSum = () => {
		const {onChangeShowTotal, showTotal} = this.props;
		const {disableTotalSum} = this.state;

		if (showTotal && disableTotalSum) {
			onChangeShowTotal(false);
		}
	};

	fetchValuesAttributes = async (dataKeys: Array<string>) => {
		const {data, fetchAttributeByCode} = this.props;
		const {values} = this.state;
		const newValues: Array<IndicatorValue> = [];

		// eslint-disable-next-line no-unused-vars
		for (const item of values) {
			let newItem: IndicatorValue = item;

			if (dataKeys.includes(item.dataKey)) {
				const dataSet = data.find(({dataKey}) => dataKey === item.dataKey);

				if (dataSet) {
					const classFqn = dataSet.source.value?.value;

					if (classFqn) {
						let indicator: PivotIndicator = item.indicator;
						const attribute = getSourceAttribute(indicator.attribute);
						const breakdown = indicator.breakdown;

						if (attribute && classFqn) {
							const newAttribute = await fetchAttributeByCode(classFqn, attribute);

							indicator = {...indicator, attribute: newAttribute};
						}

						if (breakdown) {
							const breakdownAttribute = getSourceAttribute(breakdown.attribute ?? null);

							if (breakdownAttribute) {
								const newAttribute = await fetchAttributeByCode(classFqn, breakdownAttribute);

								indicator = {...indicator, breakdown: {...breakdown, attribute: newAttribute}};
							}
						}

						newItem = {...item, indicator};
					}
				}
			}

			newValues.push(newItem);
		}

		this.setState({values: newValues}, this.updateData);
	};

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

	handleClickShowTotal = () => {
		const {onChangeShowTotal, showTotal} = this.props;
		return onChangeShowTotal(!showTotal);
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

	renderRightControl = () => {
		const {showTotal} = this.props;
		const {disableTotalSum} = this.state;

		return (
			<Fragment>
				<IconButton
					active={showTotal}
					disable={disableTotalSum}
					icon={ICON_NAMES.SUM}
					onClick={this.handleClickShowTotal}
					round={false}
				/>
				<IconButton icon={ICON_NAMES.PLUS} onClick={this.handleClickAddButton} round={false} />
			</Fragment>
		);
	};

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
