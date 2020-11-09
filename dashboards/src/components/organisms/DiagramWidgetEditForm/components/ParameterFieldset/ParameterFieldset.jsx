// @flow
import {AttributeFieldset, AttributeGroupField, FormField} from 'DiagramWidgetEditForm/components';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import type {Group} from 'store/widgets/data/types';
import type {GroupAttributeField} from 'DiagramWidgetEditForm/components/AttributeGroupField/types';
import type {OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'DiagramWidgetEditForm/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class ParameterFieldset extends PureComponent<Props> {
	static defaultProps = {
		disabled: false,
		disabledGroup: false,
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
		const {disabledGroup, group, name} = this.props;
		const {disabled: parameterDisabled, parent, value} = props;
		const disabled = parameterDisabled || disabledGroup;
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
