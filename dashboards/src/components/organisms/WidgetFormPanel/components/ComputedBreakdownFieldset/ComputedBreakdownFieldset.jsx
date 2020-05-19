// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {AttributeFieldset, AttributeGroupField} from 'WidgetFormPanel/components';
import {FieldError} from 'components/atoms';
import {FIELDS} from 'WidgetFormPanel/constants';
import {filterByAttribute, getDataErrorKey} from 'WidgetFormPanel/helpers';
import {FormField} from 'components/molecules';
import type {Group} from 'store/widgets/data/types';
import type {GroupAttributeField} from 'WidgetFormPanel/components/AttributeGroupField/types';
import type {OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'WidgetFormPanel/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class ComputedBreakdownFieldset extends PureComponent<Props> {
	filter = (options: Array<Attribute>, index: number): Array<Attribute> => {
		if (index > 0) {
			const {value} = this.props;
			const mainParameter = value[0][FIELDS.value];

			if (mainParameter) {
				options = filterByAttribute(options, mainParameter);
			}
		}

		return options;
	};

	getComputedAttributeOptions = (attribute: Attribute, index: number) => this.filter(this.props.getAttributeOptions(attribute), index);

	getComputedSourceOptions = (classFqn: string, index: number) => this.filter(this.props.getSourceOptions(classFqn), index);

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
			set = {
				...set,
				group
			};

			if (index === 0) {
				set[FIELDS.value] = value;
			}

			return set;
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
		const {index, name, onChange, transformAttribute, value} = this.props;
		value[breakdownIndex][FIELDS.value] = transformAttribute(event, this.handleSelect, breakdownIndex);

		onChange(index, name, value);
	};

	renderField = (breakdownSet: Object, breakdownIndex: number) => {
		const {data, errors, index, removable} = this.props;
		const {dataKey, group, value} = breakdownSet;
		const dataSet = data.find(set => set.dataKey === dataKey);

		if (dataSet) {
			return (
				<FormField key={index}>
					<AttributeFieldset
						getAttributeOptions={this.getComputedAttributeOptions}
						getSourceOptions={this.getComputedSourceOptions}
						index={breakdownIndex}
						name={FIELDS.value}
						onChangeLabel={this.handleChangeLabel}
						onRemove={this.handleRemove}
						onSelect={this.handleSelect}
						removable={removable}
						renderRefField={this.renderGroup(group, breakdownIndex !== 0)}
						source={dataSet[FIELDS.source]}
						value={value}
					/>
					<FieldError text={errors[getDataErrorKey(index, FIELDS.breakdown, breakdownIndex, FIELDS.value)]} />
				</FormField>
			);
		}

		return null;
	};

	renderGroup = (group: Group | null, isNotMain: boolean) => (props: Object) => {
		const {name} = this.props;
		const {disabled, parent, value} = props;
		const field = {
			name,
			parent,
			value
		};

		return (
			<AttributeGroupField
				disabled={disabled || isNotMain}
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
