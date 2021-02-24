// @flow
import BreakdownFieldset from 'DiagramWidgetEditForm/components/BreakdownFieldset';
import {countIndicators, hasDifferentAggregations} from 'DiagramWidgetEditForm/components/TableForm/helpers';
import type {DataBuilderProps} from 'DiagramWidgetEditForm/builders/DataFormBuilder/types';
import type {DataSet, DefaultBreakdown} from 'containers/DiagramWidgetEditForm/types';
import DataTopField from 'DiagramWidgetEditForm/components/DataTopField';
import type {DataTopSettings} from 'store/widgets/data/types';
import ExtendingFieldset from 'DiagramWidgetEditForm/components/ExtendingFieldset';
import FieldError from 'components/atoms/FieldError';
import {FIELDS} from 'DiagramWidgetEditForm/constants';
import FormBox from 'components/molecules/FormBox';
import {getDataErrorKey, getDefaultIndicator, getDefaultParameter, getErrorKey} from 'DiagramWidgetEditForm/helpers';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import IndicatorsBox from './components/IndicatorsBox';
import {isAllowedTopAggregation} from 'store/widgets/helpers';
import ParametersBox from './components/ParametersBox';
import type {Props as IconButtonProps} from 'components/atoms/IconButton/types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import {withDataFormBuilder} from 'DiagramWidgetEditForm/builders';

export class ParamsTab extends Component<DataBuilderProps> {
	sourceRefFields = [FIELDS.breakdown, FIELDS.column, FIELDS.row];
	mainIndex: number = 0;

	getDataSetSources = (index: number) => {
		let {fetchLinkedDataSources, linkedSources, sources, values} = this.props;

		if (index > 0) {
			const mainSource = values.data[this.mainIndex].source;

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

	handleChangeBreakdown = (index: number, breakdown: DefaultBreakdown) => {
		const {setDataFieldValue} = this.props;
		setDataFieldValue(index, FIELDS.breakdown, breakdown);
	};

	handleChangeParameters = (index: number, parameters: Array<Paremeter>) => {
		const {setDataFieldValue} = this.props;
		setDataFieldValue(index, FIELDS.parameters, parameters);
	};

	handleChangeTopSettings = (top: DataTopSettings) => {
		const {setFieldValue} = this.props;
		setFieldValue(FIELDS.top, top);
	};

	handleExtendBreakdown = (index: number) => () => {
		const {setDataFieldValue} = this.props;
		setDataFieldValue(index, FIELDS.withBreakdown, true);
	};

	handleRemoveBreakdown = (index: number = this.mainIndex) => {
		const {setDataFieldValue} = this.props;

		setDataFieldValue(index, FIELDS.breakdown, null);
		setDataFieldValue(index, FIELDS.withBreakdown, false);
	};

	renderAddInput = (props: $Shape<IconButtonProps>) => <IconButton {...props} icon={ICON_NAMES.PLUS} round={false} />;

	renderBreakdownFieldSet = () => {
		const {errors, values} = this.props;
		const dataSet = values.data[this.mainIndex];
		const show = dataSet[FIELDS.withBreakdown] || dataSet[FIELDS.breakdown];
		const errorKey = getDataErrorKey(this.mainIndex, FIELDS.breakdown);
		let {breakdown} = dataSet;

		if (!breakdown || Array.isArray(breakdown)) {
			breakdown = getDefaultParameter();
		}

		return (
			<ExtendingFieldset
				className={styles.breakdownField}
				disabled={hasDifferentAggregations(values.data)}
				index={this.mainIndex}
				onClick={this.handleExtendBreakdown(this.mainIndex)}
				show={show} text="Разбивка"
			>
				<BreakdownFieldset
					dataSet={dataSet}
					dataSetIndex={this.mainIndex}
					error={errors[errorKey]}
					key={errorKey}
					name={FIELDS.breakdown}
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
			<Fragment>
				{renderBaseBoxes()}
				{data.map(this.renderDataSet)}
				{this.renderBreakdownFieldSet()}
				{this.renderDataTopField()}
				{renderShowEmptyDataCheckbox()}
				{renderDisplayModeSelect()}
				{renderNavigationBox()}
			</Fragment>
		);
	}
}

export default withDataFormBuilder(ParamsTab);
