// @flow
import {AttributeFieldset, AttributeGroupField, FormField} from 'WidgetFormPanel/components';
import {FIELDS} from 'WidgetFormPanel/constants';
import type {Group} from 'store/widgets/data/types';
import type {GroupAttributeField} from 'WidgetFormPanel/components/AttributeGroupField/types';
import type {OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'WidgetFormPanel/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class BreakdownFieldset extends PureComponent<Props> {
	handleChangeGroup = (name: string, value: Group, field: GroupAttributeField) => {
		const {index, onChangeGroup} = this.props;
		onChangeGroup(index, name, value, field);
	};

	handleChangeLabel = (event: OnChangeAttributeLabelEvent) => {
		const {index, onChangeLabel} = this.props;
		onChangeLabel(event, index);
	};

	handleRemove = () => {
		const {index, onRemove} = this.props;
		onRemove(index);
	};

	handleSelect = (event: OnSelectAttributeEvent) => {
		const {index, onSelect} = this.props;
		onSelect(event, index);
	};

	renderGroup = (props: Object) => {
		const {name, set: currentSet} = this.props;
		const {disabled, parent, value} = props;
		const field = {
			name,
			parent,
			value
		};

		return (
			<AttributeGroupField
				disabled={disabled}
				field={field}
				name={FIELDS.breakdownGroup}
				onChange={this.handleChangeGroup}
				parent={parent}
				value={currentSet[FIELDS.breakdownGroup]}
			/>
		);
	};

	render () {
		const {error, name, removable, set: currentSet} = this.props;

		return (
			<FormField error={error}>
				<AttributeFieldset
					name={name}
					onChangeLabel={this.handleChangeLabel}
					onRemove={this.handleRemove}
					onSelect={this.handleSelect}
					removable={removable}
					renderRefField={this.renderGroup}
					source={currentSet[FIELDS.source]}
					value={currentSet[name]}
				/>
			</FormField>
		);
	}
}

export default BreakdownFieldset;
