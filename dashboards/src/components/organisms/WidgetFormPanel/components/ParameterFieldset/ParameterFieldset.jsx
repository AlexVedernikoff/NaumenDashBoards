// @flow
import type {Attribute} from 'store/sources/attributes/types';
import AttributeFieldset from 'WidgetFormPanel/components/AttributeFieldset';
import AttributeGroupField from 'WidgetFormPanel/components/AttributeGroupField';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FormField from 'WidgetFormPanel/components/FormField';
import {getDefaultSystemGroup} from 'store/widgets/helpers';
import {getErrorPath} from 'WidgetFormPanel/helpers';
import type {Group} from 'store/widgets/data/types';
import memoize from 'memoize-one';
import type {OnChangeEvent, OnSelectEvent} from 'components/types';
import type {Parameter} from 'store/widgetForms/types';
import type {Props} from './types';
import React, {createContext, PureComponent} from 'react';
import withHelpers from 'containers/DiagramWidgetForm/HOCs/withHelpers';

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

	filterOptions = (filterByRef: boolean) => (options: Array<Attribute>, dataSetIndex: number): Array<Attribute> => {
		const {filterOptions, helpers} = this.props;
		const filteredOptions = filterOptions ? filterOptions(options, dataSetIndex, filterByRef) : options;

		return helpers.filterAttributesByUsed(filteredOptions, dataSetIndex);
	};

	getComponents = memoize(() => ({
		Field: this.renderGroupWithContext
	}));

	handleChangeGroup = (group: Group, attribute: Attribute) => this.change({
		...this.props.value,
		attribute,
		group
	});

	handleChangeLabel = ({value: attribute}: OnChangeEvent<Attribute>) => this.change({
		...this.props.value,
		attribute
	});

	handleSelect = ({value: newAttribute}: OnSelectEvent) => {
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
		const {dataKey, dataSetIndex, disabled, index, onRemove, removable, source, value} = this.props;
		const {attribute} = value;

		return (
			<Context.Provider value={value}>
				<FormField path={getErrorPath(DIAGRAM_FIELDS.data, dataSetIndex, DIAGRAM_FIELDS.parameters, index)}>
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

export default withHelpers(ParameterFieldset);
