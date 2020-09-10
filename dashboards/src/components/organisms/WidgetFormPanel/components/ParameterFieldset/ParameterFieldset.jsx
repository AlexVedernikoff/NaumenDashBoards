// @flow
import {AttributeFieldset, AttributeGroupField, FormField} from 'WidgetFormPanel/components';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {FIELDS} from 'WidgetFormPanel/constants';
import type {Group} from 'store/widgets/data/types';
import type {GroupAttributeField} from 'WidgetFormPanel/components/AttributeGroupField/types';
import type {OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'WidgetFormPanel/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class ParameterFieldset extends PureComponent<Props> {
	static defaultProps = {
		disabled: false,
		removable: false
	};

	handleChangeGroup = (name: string, value: Group, field: GroupAttributeField) => {
		const {index, onChangeGroup} = this.props;
		onChangeGroup(index, name, value, field);
	};

	handleChangeLabel = (event: OnChangeAttributeLabelEvent) => {
		const {index, onChangeLabel} = this.props;
		onChangeLabel(event, index);
	};

	handleSelect = (event: OnSelectAttributeEvent) => {
		const {index, onSelect} = this.props;
		onSelect(event, index);
	};

	renderGroup = (props: Object) => {
		const {group, index, name, value: parameter} = this.props;
		const {disabled: selectDisabled, parent, value} = props;
		const disabled = selectDisabled || (index !== 0 && parameter && !(parameter.type in ATTRIBUTE_SETS.REF));
		const field = {
			disabled,
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

	render () {
		const {dataSet, disabled, error, filter, index, name, onRemove, removable, value} = this.props;

		return (
			<FormField error={error}>
				<AttributeFieldset
					dataSet={dataSet}
					disabled={disabled}
					getAttributeOptions={filter}
					getSourceOptions={filter}
					index={index}
					name={name}
					onChangeLabel={this.handleChangeLabel}
					onRemove={onRemove}
					onSelect={this.handleSelect}
					removable={removable}
					renderRefField={this.renderGroup}
					value={value}
				/>
			</FormField>
		);
	}
}

export default ParameterFieldset;
