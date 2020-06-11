// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {AttributeFieldset, AttributeGroupField, FormField} from 'WidgetFormPanel/components';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {FIELDS} from 'WidgetFormPanel/constants';
import {filterByAttribute, getDataErrorKey} from 'WidgetFormPanel/helpers';
import {getDefaultSystemGroup} from 'store/widgets/helpers';
import type {Group} from 'store/widgets/data/types';
import type {GroupAttributeField} from 'WidgetFormPanel/components/AttributeGroupField/types';
import type {OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'WidgetFormPanel/types';
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

	handleChangeGroup = (name: string, group: Group, field: GroupAttributeField) => {
		const {index, name: breakdownName, onChange} = this.props;
		let {value: breakdown} = this.props;
		let {parent, value} = field;

		if (parent) {
			value = {
				...parent,
				ref: value
			};
		}

		breakdown = breakdown.map((set, index) => {
			const updatedSet = {
				...set,
				group
			};

			if (index === 0) {
				updatedSet[FIELDS.value] = value;
			}

			return updatedSet;
		});

		onChange(index, breakdownName, breakdown);
	};

	handleChangeLabel = (event: OnChangeAttributeLabelEvent, breakdownIndex: number) => {
		const {index, name, onChange} = this.props;
		const {label: title, parent} = event;
		let {value: breakdown} = this.props;
		let value = breakdown[breakdownIndex].value;

		if (parent && value && value.ref) {
			value = {
				...value,
				ref: {
					...value.ref,
					title
				}
			};
		} else {
			value = {
				...value,
				title
			};
		}

		breakdown[breakdownIndex] = {
			...breakdown[breakdownIndex],
			value
		};

		onChange(index, name, [...breakdown]);
	};

	handleRemove = () => {
		const {index, onRemove} = this.props;
		onRemove(index);
	};

	handleSelect = (event: OnSelectAttributeEvent, breakdownIndex: number) => {
		const {index, name, onChange, transformAttribute, value: breakdown} = this.props;
		const prevValue = breakdown[breakdownIndex][FIELDS.value];
		const value = transformAttribute(event, this.handleSelect, breakdownIndex);
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
						getAttributeOptions={this.filter}
						getSourceOptions={this.filter}
						index={breakdownIndex}
						name={FIELDS.value}
						onChangeLabel={this.handleChangeLabel}
						onRemove={this.handleRemove}
						onSelect={this.handleSelect}
						removable={removable}
						renderRefField={this.renderGroup(group, breakdownIndex)}
						source={dataSet[FIELDS.source]}
						value={value}
					/>
				</FormField>
			);
		}

		return null;
	};

	renderGroup = (group: Group | null, breakdownIndex: number) => (props: Object) => {
		const {name, value: breakdown} = this.props;
		const {disabled: selectDisabled, parent, value} = props;
		const breakdownValue = breakdown[breakdownIndex].value;
		const isNotMain = breakdownIndex !== 0;
		const isNotRefAttr = breakdownValue && !(breakdownValue.type in ATTRIBUTE_SETS.REF);
		const disabled = selectDisabled || (isNotMain && isNotRefAttr);
		const field = {
			name,
			parent,
			value
		};

		return (
			<AttributeGroupField
				disabled={disabled}
				field={field}
				name={FIELDS.group}
				onChange={this.handleChangeGroup}
				parent={parent}
				value={group}
			/>
		);
	};

	render (): Array<React$Node> {
		return this.props.value.map(this.renderField);
	}
}

export default ComputedBreakdownFieldset;
