// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {AttributeFieldset, AttributeGroupField, FormField} from 'WidgetFormPanel/components';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {FIELDS} from 'WidgetFormPanel/constants';
import {filterByAttribute} from 'WidgetFormPanel/helpers';
import type {Group} from 'store/widgets/data/types';
import type {GroupAttributeField} from 'WidgetFormPanel/components/AttributeGroupField/types';
import type {OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'WidgetFormPanel/types';
import type {Props} from './types';
import React, {Component} from 'react';

export class ParameterFieldset extends Component<Props> {
	filter = (options: Array<Attribute>): Array<Attribute> => {
		const {mainSet, name, set: currentSet} = this.props;
		const mainParameter = mainSet[name];

		if (currentSet !== mainSet && !this.isDisabled() && mainParameter) {
			return filterByAttribute(options, mainParameter);
		}

		return options;
	};

	getAttributeOptions = (attribute: Attribute) => this.filter(this.props.getAttributeOptions(attribute));

	getSourceOptions = (classFqn: string) => this.filter(this.props.getSourceOptions(classFqn));

	handleChangeGroup = (name: string, value: Group, field: GroupAttributeField) => {
		const {index, onChangeGroup} = this.props;
		onChangeGroup(index, name, value, field);
	};

	handleChangeLabel = (event: OnChangeAttributeLabelEvent) => {
		const {index, onChangeLabel} = this.props;
		onChangeLabel(event, index);
	};

	handleSelect = (event: OnSelectAttributeEvent) => {
		const {index, mainSet, onSelect, set} = this.props;
		onSelect(event, index, set === mainSet);
	};

	isDisabled = () => {
		const {mainSet, set: currentSet} = this.props;
		const mainSource = mainSet[FIELDS.source];
		const currentSource = currentSet[FIELDS.source];

		return mainSet !== currentSet && mainSource && currentSource && mainSource.value === currentSource.value;
	};

	renderGroup = (props: Object) => {
		const {index, name, set: currentSet} = this.props;
		const {disabled: selectDisabled, parent, value} = props;
		const parameter = currentSet[name];
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
				value={currentSet[FIELDS.group]}
			/>
		);
	};

	render () {
		const {error, name, set: currentSet, useGroup} = this.props;
		const currentSource = currentSet[FIELDS.source];
		const value = currentSet[name];
		const disabled = this.isDisabled();
		let renderRefField;

		if (useGroup) {
			renderRefField = this.renderGroup;
		}

		return (
			<FormField error={error}>
				<AttributeFieldset
					disabled={disabled}
					getAttributeOptions={this.getAttributeOptions}
					getSourceOptions={this.getSourceOptions}
					name={name}
					onChangeLabel={this.handleChangeLabel}
					onSelect={this.handleSelect}
					renderRefField={renderRefField}
					source={currentSource}
					value={value}
				/>
			</FormField>
		);
	}
}

export default ParameterFieldset;
