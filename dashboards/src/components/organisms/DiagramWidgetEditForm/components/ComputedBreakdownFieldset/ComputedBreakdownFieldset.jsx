// @flow
import type {Attribute} from 'store/sources/attributes/types';
import AttributeFieldset from 'DiagramWidgetEditForm/components/AttributeFieldset';
import AttributeGroupField from 'DiagramWidgetEditForm/components/AttributeGroupField';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import {filterByAttribute, getDataErrorKey} from 'DiagramWidgetEditForm/helpers';
import FormField from 'DiagramWidgetEditForm/components/FormField';
import {getDefaultSystemGroup} from 'store/widgets/helpers';
import type {Group, Source} from 'store/widgets/data/types';
import type {OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {Component} from 'react';

export class ComputedBreakdownFieldset extends Component<Props> {
	filter = (options: Array<Attribute>, index: number): Array<Attribute> => {
		if (index > 0) {
			const {value} = this.props;
			const mainParameter = value[0][FIELDS.value];

			if (mainParameter) {
				return filterByAttribute(options, mainParameter);
			}
		}

		return options;
	};

	handleChangeGroup = (breakdownIndex: number) => (name: string, group: Group, value: Attribute) => {
		const {index, name: breakdownName, onChange} = this.props;
		let {value: breakdown} = this.props;

		breakdown[breakdownIndex] = {
			...breakdown[breakdownIndex],
			group,
			value
		};

		onChange(index, breakdownName, breakdown);
	};

	handleChangeLabel = ({value}: OnSelectEvent, breakdownIndex: number) => {
		const {index, name, onChange, value: breakdown} = this.props;
		const newBreakdown = breakdown.map((dataSet, index) => index === breakdownIndex ? {
			...dataSet,
			value
		} : dataSet);

		onChange(index, name, newBreakdown);
	};

	handleRemove = () => {
		const {index, onRemove} = this.props;
		onRemove(index);
	};

	handleSelect = (event: OnSelectEvent, breakdownIndex: number) => {
		const {index, name, onChange, value: breakdown} = this.props;
		const prevValue = breakdown[breakdownIndex][FIELDS.value];
		const {value} = event;
		const isMain = breakdownIndex === 0;
		const typeIsChanged = !prevValue || (prevValue && prevValue.type !== value.type);

		if (isMain && typeIsChanged) {
			const defaultGroup = getDefaultSystemGroup(value);

			breakdown.forEach((set, index) => {
				breakdown[index][FIELDS.group] = defaultGroup;

				if (index > 0) {
					breakdown[index][FIELDS.value] = null;
				}
			});
		}

		breakdown[breakdownIndex][FIELDS.value] = value;

		onChange(index, name, breakdown);
	};

	renderField = (breakdownSet: Object, breakdownIndex: number) => {
		const {data, errors, index, removable} = this.props;
		const {dataKey, group, value} = breakdownSet;
		const dataSet = data.find(set => set.dataKey === dataKey);
		const error = errors[getDataErrorKey(index, FIELDS.breakdown, breakdownIndex, FIELDS.value)];

		if (dataSet) {
			return (
				<FormField error={error} key={index}>
					<AttributeFieldset
						dataSet={dataSet}
						getAttributeOptions={this.filter}
						getSourceOptions={this.filter}
						index={breakdownIndex}
						name={FIELDS.value}
						onChangeLabel={this.handleChangeLabel}
						onRemove={this.handleRemove}
						onSelect={this.handleSelect}
						removable={removable}
						renderRefField={this.renderGroup(group, breakdownIndex, dataSet.source.value)}
						value={value}
					/>
				</FormField>
			);
		}

		return null;
	};

	renderGroup = (group: Group | null, breakdownIndex: number, source: Source | null) => (props: Object) => {
		const {value: breakdown} = this.props;
		const {disabled: selectDisabled, parent, value} = props;
		const breakdownValue = breakdown[breakdownIndex].value;
		const isNotMain = breakdownIndex !== 0;
		const isNotRefAttr = breakdownValue && !(breakdownValue.type in ATTRIBUTE_SETS.REFERENCE);
		const disabled = selectDisabled || (isNotMain && isNotRefAttr);

		return (
			<AttributeGroupField
				attribute={value}
				disabled={disabled}
				name={FIELDS.group}
				onChange={this.handleChangeGroup(breakdownIndex)}
				parent={parent}
				source={source}
				value={group}
			/>
		);
	};

	render (): Array<React$Node> {
		return this.props.value.map(this.renderField);
	}
}

export default ComputedBreakdownFieldset;
