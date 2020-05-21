// @flow
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {BreakdownFieldset, ComputedBreakdownFieldset, ExtendingFieldset, IndicatorFieldset} from 'WidgetFormPanel/components';
import type {ComputedAttr, MixedAttribute} from 'store/widgets/data/types';
import {FIELDS} from 'WidgetFormPanel/constants';
import {FormBox} from 'components/molecules';
import {getDataErrorKey} from 'WidgetFormPanel/helpers';
import {getDefaultAggregation} from '../AttributeAggregationField/helpers';
import {getMapValues} from 'src/helpers';
import {getProcessedValue} from 'store/sources/attributes/helpers';
import type {OnSelectAttributeEvent} from 'WidgetFormPanel/types';
import type {Props, State} from './types';
import React, {Component} from 'react';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export class IndicatorDataBox extends Component<Props, State> {
	static defaultProps = {
		children: null,
		name: FIELDS.indicator,
		useBreakdown: true
	};

	state = {
		sources: []
	};

	static getDerivedStateFromProps (props: Props) {
		const {getSourceOptions, values} = props;
		const sources = [];

		values.data.forEach(set => {
			const source = set[FIELDS.source];

			if (source) {
				const attributes = getSourceOptions(source.value);
				const dataKey = set[FIELDS.dataKey];

				sources.push({
					attributes,
					dataKey,
					source
				});
			}
		});

		return {
			sources
		};
	}

	createComputedBreakdown = (indicator: ComputedAttr) => {
		const {values} = this.props;
		const breakdown = [];
		const arrData = getMapValues(indicator.computeData);
		values.data.map(set => set.dataKey)
			.filter(dataKey => arrData.find(set => set.dataKey === dataKey))
			.forEach(dataKey => breakdown.push({dataKey, value: null, group: null}));

		return breakdown;
	};

	getKey = (name: string, index: number) => `${name}$${index};`;

	handleExtendBreakdown = (index: number) => {
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

	handleRemoveComputedAttribute = (index: number, name: string, code: string) => {
		const {setDataFieldValue, setFieldValue, values} = this.props;

		setFieldValue(FIELDS.computedAttrs, values.computedAttrs.filter(a => a.code !== code));
		setDataFieldValue(index, name, null);
	};

	handleSaveComputedAttribute = (index: number, name: string, newAttr: ComputedAttr) => {
		const {setDataFieldValue, setFieldValue, values} = this.props;
		const {computedAttrs} = values;
		const attrIndex = computedAttrs.findIndex(attr => attr.code === newAttr.code);

		if (attrIndex !== -1) {
			computedAttrs[attrIndex] = newAttr;
		} else {
			computedAttrs.push(newAttr);
		}

		setFieldValue(FIELDS.computedAttrs, computedAttrs);
		setDataFieldValue(index, name, newAttr);
		this.showBreakdown(index) && this.setDefaultBreakdown(index, newAttr);
	};

	handleSelectBreakdown = (event: OnSelectAttributeEvent, index: number) => {
		const {setDataFieldValue, transformAttribute} = this.props;
		const {name} = event;
		const value = transformAttribute(event, this.handleSelectBreakdown, index);

		setDataFieldValue(index, name, value);
	};

	handleSelectIndicator = (event: OnSelectAttributeEvent, index: number) => {
		const {name, setDataFieldValue, setFieldValue, transformAttribute, values} = this.props;
		const currentValue = values.data[index][name];
		let {value} = event;

		if (name === FIELDS.yAxis && index === 0) {
			const {indicator} = values;

			setFieldValue(FIELDS.indicator, {
				...indicator,
				name: getProcessedValue(value, 'title')
			});
		}

		value = transformAttribute(event, this.handleSelectIndicator, index);

		if (value && value.type !== ATTRIBUTE_TYPES.COMPUTED_ATTR && (!currentValue || currentValue.type !== value.type)) {
			setDataFieldValue(index, FIELDS.aggregation, getDefaultAggregation(value));
		}

		setDataFieldValue(index, name, value);
		this.showBreakdown(index) && this.setDefaultBreakdown(index, value);
	};

	requiredBreakdown = () => {
		const {values} = this.props;
		const {BAR_STACKED, COLUMN_STACKED, DONUT, PIE, TABLE} = WIDGET_TYPES;

		return [BAR_STACKED, COLUMN_STACKED, DONUT, PIE, TABLE].includes(values.type);
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
		const set = this.props.values.data[index];
		return this.requiredBreakdown() || set[FIELDS.withBreakdown] || set[FIELDS.breakdown];
	};

	renderBreakdownFieldSet = () => {
		const {index, name, set, useBreakdown} = this.props;
		const indicator = set[name];
		const show = this.showBreakdown(index);
		const field = indicator && indicator.type === ATTRIBUTE_TYPES.COMPUTED_ATTR
			? this.renderComputedBreakdownFieldSet(indicator)
			: this.renderDefaultBreakdownFieldSet();

		if (useBreakdown) {
			return (
				<ExtendingFieldset index={index} onClick={this.handleExtendBreakdown} show={show} text="Разбивка">
					{field}
				</ExtendingFieldset>
			);
		}
	};

	renderComputedBreakdownFieldSet = (indicator: ComputedAttr) => {
		const {errors, getAttributeOptions, getSourceOptions, index, set, setDataFieldValue, transformAttribute, values} = this.props;
		const {data} = values;
		let {breakdown} = set;

		if (!Array.isArray(breakdown)) {
			breakdown = this.createComputedBreakdown(indicator);
		}

		return (
			<ComputedBreakdownFieldset
				createDefaultValue={this.createComputedBreakdown}
				data={data}
				errors={errors}
				getAttributeOptions={getAttributeOptions}
				getSourceOptions={getSourceOptions}
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

	renderDefaultBreakdownFieldSet = () => {
		const {errors, getAttributeOptions, getSourceOptions, index, onChangeGroup, onChangeLabel, set} = this.props;
		const errorKey = getDataErrorKey(index, FIELDS.breakdown);

		return (
			<BreakdownFieldset
				error={errors[errorKey]}
				getAttributeOptions={getAttributeOptions}
				getSourceOptions={getSourceOptions}
				index={index}
				key={errorKey}
				name={FIELDS.breakdown}
				onChangeGroup={onChangeGroup}
				onChangeLabel={onChangeLabel}
				onRemove={this.handleRemoveBreakdown}
				onSelect={this.handleSelectBreakdown}
				removable={!this.requiredBreakdown()}
				set={set}
			/>
		);
	};

	renderIndicatorFieldSet = () => {
		const {errors, getAttributeOptions, getSourceOptions, index, name, onChangeLabel, set, setDataFieldValue, values} = this.props;
		const {sources} = this.state;
		const {computedAttrs} = values;

		return (
			<IndicatorFieldset
				computedAttrs={computedAttrs}
				error={errors[getDataErrorKey(index, name)]}
				getAttributeOptions={getAttributeOptions}
				getSourceOptions={getSourceOptions}
				index={index}
				key={this.getKey(name, index)}
				name={name}
				onChangeAggregation={setDataFieldValue}
				onChangeLabel={onChangeLabel}
				onRemoveComputedAttribute={this.handleRemoveComputedAttribute}
				onSaveComputedAttribute={this.handleSaveComputedAttribute}
				onSelect={this.handleSelectIndicator}
				onSelectAggregation={setDataFieldValue}
				set={set}
				sources={sources}
			/>
		);
	};

	render () {
		const {children, index, renderLeftControl, set} = this.props;
		const control = renderLeftControl && renderLeftControl(set, index);

		return (
			<FormBox leftControl={control} title="Показатель">
				{this.renderIndicatorFieldSet()}
				{this.renderBreakdownFieldSet()}
				{children}
			</FormBox>
		);
	}
}

export default IndicatorDataBox;
