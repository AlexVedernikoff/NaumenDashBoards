// @flow
import type {Attribute} from 'store/sources/attributes/types';
import AttributeFieldset from 'DiagramWidgetEditForm/components/AttributeFieldset';
import AttributeGroupField from 'DiagramWidgetEditForm/components/AttributeGroupField';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {DefaultBreakdown} from 'containers/DiagramWidgetEditForm/types';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import FormField from 'DiagramWidgetEditForm/components/FormField';
import {getDefaultSystemGroup} from 'store/widgets/helpers';
import type {Group} from 'store/widgets/data/types';
import type {OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'DiagramWidgetEditForm/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class BreakdownFieldset extends PureComponent<Props> {
	change = (breakdown: DefaultBreakdown) => {
		const {dataSetIndex, onChange} = this.props;
		onChange(dataSetIndex, breakdown);
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

	handleRemove = () => {
		const {dataSetIndex, onRemove} = this.props;
		onRemove(dataSetIndex);
	};

	handleSelect = (event: OnSelectAttributeEvent) => {
		const {value} = this.props;
		const {attribute: currentAttribute} = value;
		const {value: attribute} = event;
		let newValue = value;

		if (attribute.type !== ATTRIBUTE_TYPES.COMPUTED_ATTR && (!currentAttribute || currentAttribute.type !== attribute.type)) {
			newValue = {
				...newValue,
				group: getDefaultSystemGroup(attribute)
			};
		}

		this.change({
			...newValue,
			attribute
		});
	};

	renderGroup = (props: Object) => {
		const {dataSet, value: breakdown} = this.props;
		const {disabled, parent, value} = props;

		return (
			<AttributeGroupField
				attribute={value}
				disabled={disabled}
				name={FIELDS.breakdownGroup}
				onChange={this.handleChangeGroup}
				parent={parent}
				source={dataSet.source.value}
				value={breakdown.group}
			/>
		);
	};

	render () {
		const {dataSet, dataSetIndex, error, name, removable, value} = this.props;
		const {attribute} = value;

		return (
			<FormField error={error}>
				<AttributeFieldset
					dataSet={dataSet}
					dataSetIndex={dataSetIndex}
					name={name}
					onChangeLabel={this.handleChangeLabel}
					onRemove={this.handleRemove}
					onSelect={this.handleSelect}
					removable={removable}
					renderRefField={this.renderGroup}
					value={attribute}
				/>
			</FormField>
		);
	}
}

export default BreakdownFieldset;
