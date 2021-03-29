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
import React, {createContext, PureComponent} from 'react';
import withGetComponents from 'components/HOCs/withGetComponents';

const Context: React$Context<Parameter> = createContext({
	attribute: null,
	group: getDefaultSystemGroup()
});

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

	filterOptions = (filterByRef: boolean): Function => {
		const {filterOptions} = this.props;

		return filterOptions && filterOptions(filterByRef);
	};

	getComponents = () => this.props.getComponents({
		Field: this.renderGroupWithContext
	});

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
		const {dataSetIndex, value} = this.props;
		const {attribute} = value;
		let newValue = value;

		if (dataSetIndex === 0 && (newAttribute.type in ATTRIBUTE_SETS.REFERENCE || !attribute || attribute.type !== newAttribute.type)) {
			newValue = {
				...newValue,
				group: getDefaultSystemGroup(newAttribute)
			};
		}

		this.change({
			...newValue,
			attribute: newAttribute
		});
	};

	renderGroup = (parameter: Parameter) => {
		const {disabled: parameterDisabled, disabledGroup, source} = this.props;
		const {attribute, group} = parameter;
		const disabled = parameterDisabled || disabledGroup;

		return (
			<AttributeGroupField
				attribute={attribute}
				disabled={disabled}
				name={FIELDS.group}
				onChange={this.handleChangeGroup}
				source={source.value}
				value={group}
			/>
		);
	};

	renderGroupWithContext = () => (
		<Context.Consumer>
			{(parameter) => this.renderGroup(parameter)}
		</Context.Consumer>
	);

	render () {
		const {dataKey, dataSetIndex, disabled, error, index, onRemove, removable, source, value} = this.props;
		const {attribute} = value;

		return (
			<Context.Provider value={value}>
				<FormField error={error}>
					<AttributeFieldset
						components={this.getComponents()}
						dataKey={dataKey}
						dataSetIndex={dataSetIndex}
						disabled={disabled}
						getMainOptions={this.filterOptions(false)}
						getRefOptions={this.filterOptions(true)}
						index={index}
						onChangeLabel={this.handleChangeLabel}
						onRemove={onRemove}
						onSelect={this.handleSelect}
						removable={removable}
						renderRefField={this.renderGroup}
						source={source}
						value={attribute}
					/>
				</FormField>
			</Context.Provider>
		);
	}
}

export default withGetComponents(ParameterFieldset);
