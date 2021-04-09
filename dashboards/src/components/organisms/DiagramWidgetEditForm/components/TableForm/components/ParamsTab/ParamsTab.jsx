// @flow
import type {Breakdown, DataSet, Parameter} from 'containers/DiagramWidgetEditForm/types';
import BreakdownFieldset from 'DiagramWidgetEditForm/components/BreakdownFieldset';
import {countIndicators, hasDifferentAggregations} from 'DiagramWidgetEditForm/components/TableForm/helpers';
import type {DataBuilderProps} from 'DiagramWidgetEditForm/builders/DataFormBuilder/types';
import DataTopField from 'DiagramWidgetEditForm/components/DataTopField';
import type {DataTopSettings} from 'store/widgets/data/types';
import ExtendingFieldset from 'DiagramWidgetEditForm/components/ExtendingFieldset';
import FieldError from 'components/atoms/FieldError';
import {FIELDS} from 'DiagramWidgetEditForm/constants';
import FormBox from 'components/molecules/FormBox';
import {getDefaultBreakdown, getDefaultIndicator, getErrorKey, getParentClassFqn} from 'DiagramWidgetEditForm/helpers';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import IndicatorsBox from './components/IndicatorsBox';
import {isAllowedTopAggregation} from 'store/widgets/helpers';
import ParametersBox from './components/ParametersBox';
import {ParentSource} from 'DiagramWidgetEditForm/HOCs/withParentSource';
import type {Props as IconButtonProps} from 'components/atoms/IconButton/types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import {withDataFormBuilder} from 'DiagramWidgetEditForm/builders';

export class ParamsTab extends Component<DataBuilderProps> {
	mainIndex: number = 0;

	componentDidMount () {
		this.resetTopByIndicators();
	}

	componentDidUpdate () {
		this.resetTopByIndicators();
	}

	getDataSetSources = (index: number) => {
		let {fetchLinkedDataSources, linkedSources, sources, values} = this.props;

		if (index > 0) {
			const {value: mainSource} = values.data[this.mainIndex].source;

			if (mainSource) {
				const {value} = mainSource;
				const linkData = linkedSources[value];

				if (linkData) {
					sources = linkData.map;
				} else {
					fetchLinkedDataSources(value);
				}
			} else {
				sources = {};
			}
		}

		return sources;
	};

	getUsedDataKeys = () => [this.props.values.data[this.mainIndex].dataKey];

	handleChangeBreakdown = (breakdown: Breakdown) => {
		const {setDataFieldValue} = this.props;

		setDataFieldValue(this.mainIndex, FIELDS.breakdown, breakdown);
	};

	handleChangeParameters = (index: number, parameters: Array<Parameter>) => {
		const {setDataFieldValue} = this.props;

		setDataFieldValue(index, FIELDS.parameters, parameters);
	};

	handleChangeTopSettings = (top: DataTopSettings) => {
		const {setFieldValue} = this.props;

		setFieldValue(FIELDS.top, top);
	};

	handleExtendBreakdown = () => {
		const {setDataFieldValue, values} = this.props;
		const {dataKey} = values.data[this.mainIndex];

		setDataFieldValue(this.mainIndex, FIELDS.withBreakdown, true);
		setDataFieldValue(this.mainIndex, FIELDS.breakdown, [getDefaultBreakdown(dataKey)]);
	};

	handleRemoveBreakdown = () => {
		const {setDataFieldValue} = this.props;

		setDataFieldValue(this.mainIndex, FIELDS.breakdown, undefined);
		setDataFieldValue(this.mainIndex, FIELDS.withBreakdown, false);
	};

	resetTopByIndicators = () => {
		const {setFieldValue, values} = this.props;
		const {data, top} = values;

		if (top?.show && countIndicators(data) > 1) {
			setFieldValue(FIELDS.top, {
				...top,
				show: false
			});
		}
	};

	renderAddInput = (props: $Shape<IconButtonProps>) => <IconButton {...props} icon={ICON_NAMES.PLUS} round={false} />;

	renderBreakdownFieldSet = () => {
		const {errors, values} = this.props;
		const {data} = values;
		const dataSet = data[this.mainIndex];
		const show = dataSet[FIELDS.withBreakdown] || dataSet[FIELDS.breakdown];
		const {breakdown, indicators} = dataSet;

		return (
			<ExtendingFieldset
				className={styles.breakdownField}
				disabled={hasDifferentAggregations(values.data)}
				index={this.mainIndex}
				onClick={this.handleExtendBreakdown}
				show={show} text="Разбивка"
			>
				<BreakdownFieldset
					data={data}
					errors={errors}
					getUsedDataKeys={this.getUsedDataKeys}
					index={this.mainIndex}
					indicator={indicators[0]}
					onChange={this.handleChangeBreakdown}
					onRemove={this.handleRemoveBreakdown}
					removable={true}
					value={breakdown}
				/>
			</ExtendingFieldset>
		);
	};

	renderDataSet = (set: DataSet, index: number) => {
		const {values} = this.props;
		const {calcTotalColumn} = values;

		return (
			<Fragment>
				{this.renderSourceBox(set, index)}
				{this.renderParametersBox(set, index)}
				{this.renderIndicatorsBox(set, index, calcTotalColumn)}
			</Fragment>
		);
	};

	renderDataTopField = () => {
		const {errors, values} = this.props;
		const {data, top} = values;
		const {indicators = [getDefaultIndicator()]} = data[this.mainIndex];
		const disabled = countIndicators(data) > 1 || !isAllowedTopAggregation(indicators[0].aggregation);
		const error = errors[getErrorKey(FIELDS.top, FIELDS.count)];

		return <DataTopField disabled={disabled} error={error} onChange={this.handleChangeTopSettings} value={top} />;
	};

	renderIndicatorsBox = (dataSet: DataSet, index: number, calcTotalColumn: boolean) => {
		if (!dataSet.sourceForCompute) {
			return (
				<IndicatorsBox
					calcTotalColumn={calcTotalColumn}
					dataSet={dataSet}
					index={index}
					onRemoveBreakdown={this.handleRemoveBreakdown}
					renderAddInput={this.renderAddInput}
					renderSumInput={this.renderSumInput}
				/>
			);
		}

		return null;
	};

	renderParametersBox = (dataSet: DataSet, index: number) => (
		<ParametersBox
			dataSet={dataSet}
			errors={this.props.errors}
			index={index}
			onChange={this.handleChangeParameters}
			renderAddInput={this.renderAddInput}
		/>
	);

	renderSourceBox = (set: DataSet, index: number) => {
		const {errors, renderAddSourceInput, renderSourceFieldset} = this.props;
		const isMainSource = index === 0;
		const props = {
			sources: this.getDataSetSources(index),
			usesFilter: isMainSource
		};
		const error = index > 0 ? <FieldError className={styles.errorField} text={errors[FIELDS.sources]} /> : null;

		return (
			<FormBox rightControl={renderAddSourceInput()} title="Источник">
				{renderSourceFieldset(props)(set, index)}
				{error}
			</FormBox>
		);
	};

	renderSumInput = (props: $Shape<IconButtonProps>) => (
		<IconButton
			className={styles.sumInput}
			icon={ICON_NAMES.SUM}
			round={false}
			tip="Подсчитывать итоги"
			{...props}
		/>
	);

	render () {
		const {renderBaseBoxes, renderDisplayModeSelect, renderNavigationBox, renderShowEmptyDataCheckbox, values} = this.props;
		const {data} = values;

		return (
			<ParentSource.Provider value={getParentClassFqn(values)}>
				{renderBaseBoxes()}
				{data.map(this.renderDataSet)}
				{this.renderBreakdownFieldSet()}
				{this.renderDataTopField()}
				{renderShowEmptyDataCheckbox()}
				{renderDisplayModeSelect()}
				{renderNavigationBox()}
			</ParentSource.Provider>
		);
	}
}

export default withDataFormBuilder(ParamsTab);
