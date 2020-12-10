// @flow
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {BreakdownFieldset, ComputedBreakdownFieldset, DataTopField, ExtendingFieldset, IndicatorFieldset} from 'DiagramWidgetEditForm/components';
import type {ComputedAttr, DataTopSettings, MixedAttribute} from 'store/widgets/data/types';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import {FormBox} from 'components/molecules';
import {getDataErrorKey} from 'DiagramWidgetEditForm/helpers';
import {getDefaultAggregation} from 'DiagramWidgetEditForm/components/AttributeAggregationField/helpers';
import {getDefaultSystemGroup, isAllowedTopAggregation} from 'store/widgets/helpers';
import {getMapValues} from 'src/helpers';
import {LegacyCheckbox as Checkbox} from 'components/atoms';
import type {OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'DiagramWidgetEditForm/types';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import {WIDGET_TYPES} from 'store/widgets/data/constants';
import withForm from 'DiagramWidgetEditForm/withForm';

export class IndicatorDataBox extends PureComponent<Props> {
	static defaultProps = {
		children: null,
		name: FIELDS.indicator,
		usesBreakdown: true,
		usesEmptyData: false,
		usesTop: false
	};

	createComputedBreakdown = (indicator: ComputedAttr) => {
		const {values} = this.props;
		const breakdown = [];
		const arrData = getMapValues(indicator.computeData);
		values.data.map(set => set.dataKey)
			.filter(dataKey => arrData.find(set => set.dataKey === dataKey))
			.forEach(dataKey => breakdown.push({dataKey, group: null, value: null}));

		return breakdown;
	};

	getKey = (name: string, index: number) => `${name}$${index};`;

	handleChangeAttributeTitle = (event: OnChangeAttributeLabelEvent, index: number) => {
		const {changeAttributeTitle, setDataFieldValue, values} = this.props;
		const {label, name, parent} = event;
		const parameter = values.data[index][name];

		setDataFieldValue(index, name, changeAttributeTitle(parameter, parent, label));
	};

	handleChangeShowEmptyData = (name: string, value: boolean) => {
		const {index, setDataFieldValue} = this.props;
		setDataFieldValue(index, name, value);
	};

	handleChangeTopSettings = (top: DataTopSettings) => {
		const {index, setDataFieldValue} = this.props;
		setDataFieldValue(index, FIELDS.top, top);
	};

	handleExtendBreakdown = (index: number) => () => {
		const {name, setDataFieldValue, values} = this.props;
		const indicator = values.data[index][name];

		setDataFieldValue(index, FIELDS.withBreakdown, true);
		this.setDefaultBreakdown(index, indicator);
	};

	handleRemoveBreakdown = (index: number) => {
		const {setDataFieldValue} = this.props;

		setDataFieldValue(index, FIELDS.breakdown, null);
		setDataFieldValue(index, FIELDS.withBreakdown, false);
	};

	handleRemoveComputedAttribute = (index: number, name: string, value: ComputedAttr) => {
		const {removeComputedAttribute, setDataFieldValue} = this.props;

		removeComputedAttribute(value);
		setDataFieldValue(index, name, null);
	};

	handleSaveComputedAttribute = (index: number, name: string, attribute: ComputedAttr) => {
		const {saveComputedAttribute, setDataFieldValue} = this.props;

		saveComputedAttribute(attribute);
		setDataFieldValue(index, name, attribute);
		this.showBreakdown(index) && this.setDefaultBreakdown(index, attribute);
	};

	handleSelectBreakdown = (event: OnSelectAttributeEvent, index: number) => {
		const {setDataFieldValue, transformAttribute, values} = this.props;
		const {name} = event;
		const {[name]: prevValue} = values.data[index];
		const nextValue = transformAttribute(event, this.handleSelectBreakdown, index);

		if (nextValue.type !== ATTRIBUTE_TYPES.COMPUTED_ATTR && (!prevValue || prevValue.type !== nextValue.type)) {
			setDataFieldValue(index, FIELDS.breakdownGroup, getDefaultSystemGroup(nextValue));
		}

		setDataFieldValue(index, name, nextValue);
	};

	handleSelectIndicator = (event: OnSelectAttributeEvent, index: number) => {
		const {name, onSelectCallback, setDataFieldValue, transformAttribute, values} = this.props;
		const currentValue = values.data[index][name];
		let {value} = event;
		let callback;

		if (onSelectCallback) {
			callback = onSelectCallback(index);
		}

		value = transformAttribute(event, this.handleSelectIndicator, index);

		if (value && value.type !== ATTRIBUTE_TYPES.COMPUTED_ATTR && (!currentValue || currentValue.type !== value.type)) {
			setDataFieldValue(index, FIELDS.aggregation, getDefaultAggregation(value));
		}

		setDataFieldValue(index, name, value, callback);
		this.showBreakdown(index) && this.setDefaultBreakdown(index, value);
	};

	requiredBreakdown = () => {
		const {values} = this.props;
		const {BAR_STACKED, COLUMN_STACKED, DONUT, PIE} = WIDGET_TYPES;

		return [BAR_STACKED, COLUMN_STACKED, DONUT, PIE].includes(values.type);
	};

	setDefaultBreakdown = (index: number, indicator: MixedAttribute | null) => {
		const {setDataFieldValue, values} = this.props;
		const set = values.data[index];
		let {breakdown} = set;

		if (indicator && indicator.type === ATTRIBUTE_TYPES.COMPUTED_ATTR && !Array.isArray(breakdown)) {
			breakdown = this.createComputedBreakdown(indicator);
		} else if (Array.isArray(breakdown)) {
			breakdown = null;
		}

		setDataFieldValue(index, FIELDS.breakdown, breakdown);
	};

	showBreakdown = (index: number) => {
		const dataSet = this.props.values.data[index];
		return this.requiredBreakdown() || dataSet[FIELDS.withBreakdown] || dataSet[FIELDS.breakdown];
	};

	renderBreakdownFieldSet = () => {
		const {dataSet, index, name, usesBreakdown} = this.props;
		const indicator = dataSet[name];

		if (usesBreakdown) {
			const show = this.showBreakdown(index);
			const field = indicator && indicator.type === ATTRIBUTE_TYPES.COMPUTED_ATTR
				? this.renderComputedBreakdownFieldSet(indicator)
				: this.renderDefaultBreakdownFieldSet();

			return (
				<ExtendingFieldset index={index} onClick={this.handleExtendBreakdown(index)} show={show} text="Разбивка">
					{field}
				</ExtendingFieldset>
			);
		}
	};

	renderComputedBreakdownFieldSet = (indicator: ComputedAttr) => {
		const {dataSet, errors, index, setDataFieldValue, transformAttribute, values} = this.props;
		const {data} = values;
		let {breakdown} = dataSet;

		if (!Array.isArray(breakdown)) {
			breakdown = this.createComputedBreakdown(indicator);
		}

		return (
			<ComputedBreakdownFieldset
				createDefaultValue={this.createComputedBreakdown}
				data={data}
				errors={errors}
				index={index}
				key={getDataErrorKey(FIELDS.breakdown, index)}
				name={FIELDS.breakdown}
				onChange={setDataFieldValue}
				onRemove={this.handleRemoveBreakdown}
				removable={!this.requiredBreakdown()}
				transformAttribute={transformAttribute}
				value={breakdown}
			/>
		);
	};

	renderDataTopField = () => {
		const {usesTop} = this.props;
		const {aggregation, top} = this.props.dataSet;
		const disabled = !isAllowedTopAggregation(aggregation);

		return usesTop && <DataTopField disabled={disabled} onChange={this.handleChangeTopSettings} value={top} />;
	};

	renderDefaultBreakdownFieldSet = () => {
		const {dataSet, errors, handleChangeGroup, index} = this.props;
		const errorKey = getDataErrorKey(index, FIELDS.breakdown);

		return (
			<BreakdownFieldset
				dataSet={dataSet}
				dataSetIndex={index}
				error={errors[errorKey]}
				index={index}
				key={errorKey}
				name={FIELDS.breakdown}
				onChangeGroup={handleChangeGroup}
				onChangeLabel={this.handleChangeAttributeTitle}
				onRemove={this.handleRemoveBreakdown}
				onSelect={this.handleSelectBreakdown}
				removable={!this.requiredBreakdown()}
			/>
		);
	};

	renderIndicator = () => {
		const {children, dataSet, index, renderLeftControl} = this.props;
		const control = renderLeftControl && renderLeftControl(dataSet, index);

		return (
			<FormBox leftControl={control} title="Показатель">
				{this.renderIndicatorFieldSet()}
				{this.renderBreakdownFieldSet()}
				{this.renderDataTopField()}
				{children}
			</FormBox>
		);
	};

	renderIndicatorFieldSet = () => {
		const {dataSet, errors, index, name, setDataFieldValue, values} = this.props;
		const {computedAttrs} = values;

		return (
			<IndicatorFieldset
				aggregation={dataSet[FIELDS.aggregation]}
				computedAttrs={computedAttrs}
				dataSet={dataSet}
				error={errors[getDataErrorKey(index, name)]}
				index={index}
				key={this.getKey(name, index)}
				name={name}
				onChangeAggregation={setDataFieldValue}
				onChangeLabel={this.handleChangeAttributeTitle}
				onRemoveComputedAttribute={this.handleRemoveComputedAttribute}
				onSaveComputedAttribute={this.handleSaveComputedAttribute}
				onSelect={this.handleSelectIndicator}
				onSelectAggregation={setDataFieldValue}
				value={dataSet[name]}
			/>
		);
	};

	renderShowEmptyDataBox = () => {
		const {dataSet, usesEmptyData} = this.props;
		const {showEmptyData} = dataSet;

		if (usesEmptyData) {
			return (
				<FormBox>
					<Checkbox
						label="Учитывать незаполненные данные"
						name={FIELDS.showEmptyData}
						onClick={this.handleChangeShowEmptyData}
						value={showEmptyData}
					/>
				</FormBox>
			);
		}
	};

	render () {
		return (
			<Fragment>
				{this.renderIndicator()}
				{this.renderShowEmptyDataBox()}
			</Fragment>
		);
	}
}

export default withForm(IndicatorDataBox);
