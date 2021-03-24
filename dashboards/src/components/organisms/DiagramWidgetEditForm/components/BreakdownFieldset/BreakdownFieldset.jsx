// @flow
import type {Attribute} from 'store/sources/attributes/types';
import AttributeFieldset from 'DiagramWidgetEditForm/components/AttributeFieldset';
import AttributeGroupField from 'DiagramWidgetEditForm/components/AttributeGroupField';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {BreakdownItem} from 'containers/DiagramWidgetEditForm/types';
import type {FieldContext, Props} from './types';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import {filterByAttribute, getDataErrorKey} from 'DiagramWidgetEditForm/helpers';
import FormField from 'DiagramWidgetEditForm/components/FormField';
import {getDefaultSystemGroup} from 'store/widgets/helpers';
import {getMapValues} from 'helpers';
import type {Group} from 'store/widgets/data/types';
import type {OnSelectEvent} from 'components/types';
import React, {Component, createContext} from 'react';

const Context: React$Context<FieldContext> = createContext({
	breakdown: {
		attribute: null,
		dataKey: '',
		group: getDefaultSystemGroup()
	},
	breakdownIndex: 0,
	source: null
});

export class BreakdownFieldset extends Component<Props> {
	mainIndex = 0;

	static defaultProps = {
		dataKey: '',
		value: []
	};

	componentDidMount () {
		this.resetBreakdownIfIsNotValid();
	}

	componentDidUpdate (prevProps: Props) {
		const {indicator} = this.props;
		const {indicator: prevIndicator} = prevProps;
		const {COMPUTED_ATTR} = ATTRIBUTE_TYPES;
		const switchToComputedIndicator = prevIndicator && prevIndicator.type !== COMPUTED_ATTR
			&& indicator && indicator.type === COMPUTED_ATTR;
		const switchFromComputedIndicator = prevIndicator && prevIndicator.type === COMPUTED_ATTR
			&& indicator && indicator.type !== COMPUTED_ATTR;

		if (switchToComputedIndicator || switchFromComputedIndicator) {
			this.resetBreakdownIfIsNotValid();
		}
	}

	filterOptions = (filterByRef: boolean) => (options: Array<Attribute>, index: number): Array<Attribute> => {
		if (index > this.mainIndex) {
			const {value} = this.props;
			const mainParameter = value[this.mainIndex].attribute;

			if (mainParameter) {
				return filterByAttribute(options, mainParameter, filterByRef);
			}
		}

		return options;
	};

	handleChangeGroup = (breakdownIndex: number) => (name: string, group: Group, attribute: Attribute) => {
		const {onChange, value} = this.props;
		const newBreakdown = value.map((item, i) => breakdownIndex === i ? {...item, attribute, group} : item);

		onChange(newBreakdown);
	};

	handleChangeLabel = ({value: attribute}: OnSelectEvent, breakdownIndex: number) => {
		const {onChange, value: breakdown} = this.props;
		const newBreakdown = breakdown.map((item, i) => i === breakdownIndex ? {...item, attribute} : item);

		onChange(newBreakdown);
	};

	handleSelect = (event: OnSelectEvent, breakdownIndex: number) => {
		const {onChange, value: breakdown} = this.props;
		const {attribute: prevAttribute} = breakdown[breakdownIndex];
		const {value: attribute} = event;
		const isMain = breakdownIndex === this.mainIndex;
		const typeIsChanged = !prevAttribute || prevAttribute.type !== attribute.type;
		let newBreakdown = breakdown.map((item, i) => i === breakdownIndex ? {...item, attribute} : item);

		if (isMain && typeIsChanged) {
			const defaultGroup = getDefaultSystemGroup(attribute);

			newBreakdown = newBreakdown.map((item, index) => ({
				...item,
				attribute: index === this.mainIndex ? item.attribute : null,
				group: defaultGroup
			}));
		}

		onChange(newBreakdown);
	};

	resetBreakdownIfIsNotValid = () => {
		const {data, dataKey, getUsedDataKeys, indicator, onChange, value} = this.props;

		if (value) {
			const breakdownKeys = value.map(({dataKey}) => dataKey);
			let usedKeys = [dataKey];

			if (indicator && indicator.type === ATTRIBUTE_TYPES.COMPUTED_ATTR) {
				usedKeys = getMapValues(indicator.computeData)
					.reduce((usedKeys, {dataKey}) => !usedKeys.includes(dataKey) ? [...usedKeys, dataKey] : dataKey, usedKeys);
			} else if (getUsedDataKeys) {
				usedKeys = getUsedDataKeys(data);
			}

			if (usedKeys.sort().toString() !== breakdownKeys.sort().toString()) {
				onChange(usedKeys.map(dataKey => ({
					attribute: null,
					dataKey,
					group: getDefaultSystemGroup()
				})));
			}
		}
	};

	renderField = (item: BreakdownItem, breakdownIndex: number) => {
		const {data, errors, index, onRemove, removable} = this.props;
		const {attribute, dataKey} = item;
		const dataSet = data.find(set => set.dataKey === dataKey);
		const error = errors[getDataErrorKey(index, FIELDS.breakdown, breakdownIndex)];

		if (dataSet) {
			const {dataKey, source} = dataSet;
			const context: FieldContext = {
				breakdown: item,
				breakdownIndex,
				source: source.value
			};
			const components = {
				Field: this.renderGroupWithContext
			};

			return (
				<Context.Provider value={context}>
					<FormField error={error} key={index}>
						<AttributeFieldset
							components={components}
							dataKey={dataKey}
							getMainOptions={this.filterOptions(false)}
							getRefOptions={this.filterOptions(true)}
							index={breakdownIndex}
							onChangeLabel={this.handleChangeLabel}
							onRemove={onRemove}
							onSelect={this.handleSelect}
							removable={removable}
							source={source}
							value={attribute}
						/>
					</FormField>
				</Context.Provider>
			);
		}

		return null;
	};

	renderGroup = (context: FieldContext) => {
		const {breakdown, breakdownIndex, source} = context;
		const {attribute, group} = breakdown;
		const isNotMain = breakdownIndex !== this.mainIndex;
		const isNotRefAttr = attribute && !(attribute.type in ATTRIBUTE_SETS.REFERENCE);
		const disabled = Boolean(isNotMain && isNotRefAttr);

		return (
			<AttributeGroupField
				attribute={attribute}
				disabled={disabled}
				name={FIELDS.group}
				onChange={this.handleChangeGroup(breakdownIndex)}
				source={source}
				value={group}
			/>
		);
	};

	renderGroupWithContext = () => (
		<Context.Consumer>
			{(context) => this.renderGroup(context)}
		</Context.Consumer>
	);

	render (): Array<React$Node> {
		return this.props.value.map(this.renderField);
	}
}

export default BreakdownFieldset;
