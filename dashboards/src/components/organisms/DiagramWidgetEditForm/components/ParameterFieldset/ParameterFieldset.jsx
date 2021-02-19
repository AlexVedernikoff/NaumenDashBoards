// @flow
import type {Attribute} from 'store/sources/attributes/types';
import AttributeFieldset from 'DiagramWidgetEditForm/components/AttributeFieldset';
import AttributeGroupField from 'DiagramWidgetEditForm/components/AttributeGroupField';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import FormField from 'DiagramWidgetEditForm/components/FormField';
import {getDefaultSystemGroup} from 'store/widgets/helpers';
import type {Group} from 'store/widgets/data/types';
import type {OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'DiagramWidgetEditForm/types';
import type {Parameter} from 'containers/DiagramWidgetEditForm/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class ParameterFieldset extends PureComponent<Props> {
	static defaultProps = {
		disabled: false,
		disabledGroup: false,
		removable: false
	};

	change = (parameter: Parameter) => {
		const {dataSetIndex, index, onChange} = this.props;
		onChange(dataSetIndex, index, parameter);
	};

	handleChangeGroup = (name: string, group: Group, attribute: Attribute) => this.change({
		...this.props.value,
		attribute,
		group
	});

	handleChangeLabel = ({value: attribute}: OnChangeAttributeLabelEvent) => this.change({
		...this.props.value,
		attribute
	});

	handleSelect = ({value: newAttribute}: OnSelectAttributeEvent) => {
		const {index, value} = this.props;
		const {attribute} = value;
		let newValue = value;

		if (index === 0 && (!attribute || newAttribute.type in ATTRIBUTE_SETS.REFERENCE || attribute.type !== newAttribute.type)) {
			newValue = {
				...newValue,
				group: getDefaultSystemGroup(value)
			};
		}

		this.change({
			...newValue,
			attribute: newAttribute
		});
	};

	renderGroup = (props: Object) => {
		const {dataSet, disabledGroup, value} = this.props;
		const {disabled: parameterDisabled, parent, value: attribute} = props;
		const {group} = value;
		const disabled = parameterDisabled || disabledGroup;

		return (
			<AttributeGroupField
				attribute={attribute}
				disabled={disabled}
				name={FIELDS.group}
				onChange={this.handleChangeGroup}
				parent={parent}
				source={dataSet.source.value}
				value={group}
			/>
		);
	};

	render () {
		const {dataSet, dataSetIndex, disabled, error, filter, index, onRemove, removable, value} = this.props;
		const {attribute} = value;

		return (
			<FormField error={error}>
				<AttributeFieldset
					dataSet={dataSet}
					dataSetIndex={dataSetIndex}
					disabled={disabled}
					getAttributeOptions={filter}
					getSourceOptions={filter}
					index={index}
					onChangeLabel={this.handleChangeLabel}
					onRemove={onRemove}
					onSelect={this.handleSelect}
					removable={removable}
					renderRefField={this.renderGroup}
					value={attribute}
				/>
			</FormField>
		);
	}
}

export default ParameterFieldset;
