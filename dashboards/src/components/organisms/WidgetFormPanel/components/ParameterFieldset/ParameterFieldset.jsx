// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {AttributeFieldset, AttributeGroupField} from 'WidgetFormPanel/components';
import {FieldError} from 'components/atoms';
import {FIELDS} from 'WidgetFormPanel/constants';
import {filterByAttribute} from 'WidgetFormPanel/helpers';
import {FormField} from 'components/molecules';
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
			options = filterByAttribute(options, mainParameter);
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
			<FormField>
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
				<FieldError text={error} />
			</FormField>
		);
	}
}

export default ParameterFieldset;
