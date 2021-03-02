// @flow
import type {Attribute} from 'store/sources/attributes/types';
import AttributeFieldset from 'DiagramWidgetEditForm/components/AttributeFieldset';
import AttributeGroupField from 'DiagramWidgetEditForm/components/AttributeGroupField';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {BreakdownItem, DataSet} from 'containers/DiagramWidgetEditForm/types';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import {filterByAttribute, getDataErrorKey} from 'DiagramWidgetEditForm/helpers';
import FormField from 'DiagramWidgetEditForm/components/FormField';
import {getDefaultSystemGroup} from 'store/widgets/helpers';
import {getMapValues} from 'helpers';
import type {Group, Source} from 'store/widgets/data/types';
import type {OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {Component} from 'react';
import type {RefProps} from 'DiagramWidgetEditForm/components/AttributeFieldset/types';

const getUsedDataKeys = (data: Array<DataSet>): Array<string> => {
	return data.filter(dataSet => !dataSet.sourceForCompute).map(dataSet => dataSet.dataKey);
};

export class BreakdownFieldset extends Component<Props> {
	mainIndex = 0;

	static defaultProps = {
		getUsedDataKeys,
		value: []
	};

	componentDidMount () {
		this.resetBreakdownIfIsNotValid();
	}

	componentDidUpdate (prevProps: Props) {
		const {indicator} = this.props;
		const {indicator: prevIndicator} = prevProps;
		const {COMPUTED_ATTR} = ATTRIBUTE_TYPES;
		const switchToComputedIndicator = prevIndicator && prevIndicator.type !== COMPUTED_ATTR
			&& indicator && indicator.type === COMPUTED_ATTR;
		const switchFromComputedIndicator = prevIndicator && prevIndicator.type === COMPUTED_ATTR
			&& indicator && indicator.type !== COMPUTED_ATTR;

		if (switchToComputedIndicator || switchFromComputedIndicator) {
			this.resetBreakdownIfIsNotValid();
		}
	}

	filter = (options: Array<Attribute>, index: number): Array<Attribute> => {
		if (index > this.mainIndex) {
			const {value} = this.props;
			const mainParameter = value[this.mainIndex].attribute;

			if (mainParameter) {
				return filterByAttribute(options, mainParameter);
			}
		}

		return options;
	};

	handleChangeGroup = (breakdownIndex: number) => (name: string, group: Group, attribute: Attribute) => {
		const {onChange, value} = this.props;
		const newBreakdown = value.map((item, i) => breakdownIndex === i ? {...item, attribute, group} : item);

		onChange(newBreakdown);
	};

	handleChangeLabel = ({value: attribute}: OnSelectEvent, breakdownIndex: number) => {
		const {onChange, value: breakdown} = this.props;
		const newBreakdown = breakdown.map((item, i) => i === breakdownIndex ? {...item, attribute} : item);

		onChange(newBreakdown);
	};

	handleSelect = (event: OnSelectEvent, breakdownIndex: number) => {
		const {onChange, value: breakdown} = this.props;
		const {attribute: prevAttribute} = breakdown[breakdownIndex];
		const {value: attribute} = event;
		const isMain = breakdownIndex === this.mainIndex;
		const typeIsChanged = !prevAttribute || prevAttribute.type !== attribute.type;
		let newBreakdown = breakdown.map((item, i) => i === breakdownIndex ? {...item, attribute} : item);

		if (isMain && typeIsChanged) {
			const defaultGroup = getDefaultSystemGroup(attribute);

			newBreakdown = newBreakdown.map((item, index) => ({
				...item,
				attribute: index === this.mainIndex ? item.attribute : null,
				group: defaultGroup
			}));
		}

		onChange(newBreakdown);
	};

	resetBreakdownIfIsNotValid = () => {
		const {data, getUsedDataKeys, indicator, onChange, value} = this.props;

		if (value) {
			const breakdownKeys = value.map(({dataKey}) => dataKey);
			let usedKeys = [];

			if (indicator && indicator.type === ATTRIBUTE_TYPES.COMPUTED_ATTR) {
				usedKeys = getMapValues(indicator.computeData)
					.reduce((usedKeys, {dataKey}) => !usedKeys.includes(dataKey) ? [...usedKeys, dataKey] : dataKey, usedKeys);
			} else {
				usedKeys = getUsedDataKeys(data);
			}

			if (usedKeys.sort().toString() !== breakdownKeys.sort().toString()) {
				onChange(usedKeys.map(dataKey => ({
					attribute: null,
					dataKey,
					group: getDefaultSystemGroup()
				})));
			}
		}
	};

	renderField = (item: BreakdownItem, breakdownIndex: number) => {
		const {data, errors, index, onRemove, removable} = this.props;
		const {attribute, dataKey, group} = item;
		const dataSet = data.find(set => set.dataKey === dataKey);
		const error = errors[getDataErrorKey(index, FIELDS.breakdown, breakdownIndex)];

		if (dataSet) {
			const {source} = dataSet;

			return (
				<FormField error={error} key={index}>
					<AttributeFieldset
						dataSet={dataSet}
						getAttributeOptions={this.filter}
						getSourceOptions={this.filter}
						index={breakdownIndex}
						onChangeLabel={this.handleChangeLabel}
						onRemove={onRemove}
						onSelect={this.handleSelect}
						removable={removable}
						renderRefField={this.renderGroup(group, breakdownIndex, source.value)}
						value={attribute}
					/>
				</FormField>
			);
		}

		return null;
	};

	renderGroup = (group: Group | null, breakdownIndex: number, source: Source | null) => (props: RefProps) => {
		const {disabled: selectDisabled, parent, value: attribute} = props;
		const isNotMain = breakdownIndex !== this.mainIndex;
		const isNotRefAttr = attribute && !(attribute.type in ATTRIBUTE_SETS.REFERENCE);
		const disabled = Boolean(selectDisabled || (isNotMain && isNotRefAttr));

		return (
			<AttributeGroupField
				attribute={parent || attribute}
				disabled={disabled}
				name={FIELDS.group}
				onChange={this.handleChangeGroup(breakdownIndex)}
				source={source}
				value={group}
			/>
		);
	};

	render (): Array<React$Node> {
		return this.props.value.map(this.renderField);
	}
}

export default BreakdownFieldset;
