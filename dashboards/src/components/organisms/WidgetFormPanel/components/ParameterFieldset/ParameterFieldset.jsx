// @flow
import type {Attribute} from 'store/sources/attributes/types';
import AttributeFieldset from 'WidgetFormPanel/components/AttributeFieldset';
import AttributeGroupField from 'containers/AttributeGroupField';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import Container from 'components/atoms/Container';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FormField from 'WidgetFormPanel/components/FormField';
import {getDefaultSystemGroup} from 'store/widgets/helpers';
import {getErrorPath} from 'WidgetFormPanel/helpers';
import type {Group} from 'store/widgets/data/types';
import type {OnChangeEvent, OnSelectEvent} from 'components/types';
import type {Parameter} from 'store/widgetForms/types';
import type {Props} from './types';
import React, {Component, createContext} from 'react';
import SourcesAndFieldsExtended, {FIELD_TYPE} from 'WidgetFormPanel/components/SourcesAndFieldsExtended';
import withAttributesHelpers from 'containers/DiagramWidgetForm/HOCs/withAttributesHelpers';

const Context: React$Context<Parameter> = createContext({
	attribute: null,
	format: null,
	group: getDefaultSystemGroup()
});

Context.displayName = 'PARAMETER_FIELDSET_CONTEXT';

export class ParameterFieldset extends Component<Props> {
	static defaultProps = {
		disabled: false,
		disabledGroup: false,
		removable: false
	};

	change = (parameter: Parameter, callback?: Function) => {
		const {dataSetIndex, index, onChange} = this.props;
		return onChange(dataSetIndex, index, parameter, callback);
	};

	filterOptions = (filterByRef: boolean) => (options: Array<Attribute>, dataSetIndex: number): Array<Attribute> => {
		const {filterOptions, helpers, value} = this.props;
		const {attribute} = value;
		const filteredOptions = filterOptions ? filterOptions(options, dataSetIndex, filterByRef) : options;

		return helpers.filterAttributesByUsed(filteredOptions, dataSetIndex, [attribute]);
	};

	getChangeDataSetHandler = (index: number) => (dataSetIndex: number) => {
		const {onChangeDataSet} = this.props;

		if (onChangeDataSet) {
			onChangeDataSet(index, dataSetIndex);
		}
	};

	getMainComponents = () => ({
		Field: this.renderGroupWithContext,
		MenuContainer: this.renderMenuContainer
	});

	getRefComponents = () => ({
		Field: this.renderGroupWithContext
	});

	handleChangeGroup = (group: Group, attribute: Attribute) => this.change({
		...this.props.value,
		attribute,
		group
	});

	handleChangeLabel = ({value: attribute}: OnChangeEvent<Attribute>, index: number, callback?: Function) =>
		this.change({
			...this.props.value,
			attribute
		}, callback);

	handleSelect = ({value: newAttribute}: OnSelectEvent) => {
		const {dataSetIndex, value} = this.props;
		const {attribute} = value;
		let newValue = value;
		const mustClearGroup = newAttribute.type in ATTRIBUTE_SETS.REFERENCE
			|| !attribute
			|| attribute.type !== newAttribute.type
			|| attribute.timerValue !== newAttribute.timerValue;

		if (dataSetIndex === 0 && mustClearGroup) {
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
			{parameter => this.renderGroup(parameter)}
		</Context.Consumer>
	);

	renderMenuContainer = ({children, className}) => {
		const {dataSets} = this.props;

		if (dataSets) {
			return this.renderSourcesAndFields(className, children);
		}

		return (
			<Container className={className}>
				{children}
			</Container>
		);
	};

	renderSourcesAndFields = (className: string, fieldSelectMainContainer: Array<React$Node>) => {
		const {dataSetIndex, dataSets, index, value} = this.props;
		const {attribute} = value;

		return (
			<SourcesAndFieldsExtended
				className={className}
				dataSetIndex={dataSetIndex}
				dataSets={dataSets}
				fieldType={FIELD_TYPE.PARAMETER}
				onChangeDataSet={this.getChangeDataSetHandler(index)}
				value={attribute}
			>
				{fieldSelectMainContainer}
			</SourcesAndFieldsExtended>
		);
	};

	render () {
		const {dataKey, dataSetIndex, disabled, index, onRemove, removable, source, value} = this.props;
		const {attribute} = value;

		return (
			<Context.Provider value={value}>
				<FormField path={getErrorPath(DIAGRAM_FIELDS.data, dataSetIndex, DIAGRAM_FIELDS.parameters, index)}>
					<AttributeFieldset
						components={this.getMainComponents()}
						dataKey={dataKey}
						dataSetIndex={dataSetIndex}
						disabled={disabled}
						getMainOptions={this.filterOptions(false)}
						getRefOptions={this.filterOptions(true)}
						index={index}
						onChangeLabel={this.handleChangeLabel}
						onRemove={onRemove}
						onSelect={this.handleSelect}
						refComponents={this.getRefComponents()}
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

export default withAttributesHelpers(ParameterFieldset);
