// @flow
import type {Attribute} from 'store/sources/attributes/types';
import AttributeFieldset from 'WidgetFormPanel/components/AttributeFieldset';
import AttributeGroupField from 'containers/AttributeGroupField';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {BreakdownItem} from 'store/widgetForms/types';
import cn from 'classnames';
import {compose} from 'redux';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import ExtendButton from 'components/atoms/ExtendButton';
import type {FieldContext, Props} from './types';
import FormField from 'WidgetFormPanel/components/FormField';
import {getDefaultSystemGroup} from 'store/widgets/helpers';
import {getErrorPath} from 'WidgetFormPanel/helpers';
import {getMapValues} from 'helpers';
import type {Group} from 'store/widgets/data/types';
import type {OnSelectEvent} from 'components/types';
import React, {Component, createContext} from 'react';
import styles from './styles.less';
import t from 'localization';
import withAttributesHelpers from 'containers/DiagramWidgetForm/HOCs/withAttributesHelpers';
import withValues from 'components/organisms/WidgetForm/HOCs/withValues';

const Context: React$Context<FieldContext> = createContext({
	breakdown: {
		attribute: null,
		dataKey: '',
		group: getDefaultSystemGroup()
	},
	breakdownIndex: 0,
	isMainSource: true,
	source: null
});

Context.displayName = 'BREAKDOWN_FIELDSET_CONTEXT';

export class BreakdownFieldset extends Component<Props> {
	mainIndex = 0;

	static defaultProps = {
		className: '',
		dataKey: '',
		disabled: false,
		filterAttributesByMain: false,
		isMain: true,
		onlyCommonAttributes: false,
		required: false,
		value: []
	};

	componentDidMount () {
		if (this.props.required) {
			this.createNewBreakdown();
		} else {
			this.clearUnusedBreakdowns();
		}
	}

	componentDidUpdate (prevProps: Props) {
		const {removable} = this.props;
		const {removable: prevRemovable} = prevProps;

		if (prevRemovable && !removable) {
			this.createNewBreakdown();
		}

		if (!prevRemovable && removable) {
			this.clearUnusedBreakdowns();
		}
	}

	clearUnusedBreakdowns = () => {
		const {onRemove, value} = this.props;

		if (value.length > 0 && !value[0].attribute) {
			onRemove();
		}
	};

	createNewBreakdown = () => {
		const {dataKey, getUsedDataKeys, indicator, onChange, value, values} = this.props;
		const breakdownKeys = value.map(({dataKey}) => dataKey);
		let usedKeys = [];

		if (indicator && indicator.type === ATTRIBUTE_TYPES.COMPUTED_ATTR) {
			getMapValues(indicator.computeData)
				.forEach(({dataKey}) => {
					if (!usedKeys.includes(dataKey)) {
						usedKeys.push(dataKey);
					}
				});
		} else {
			usedKeys = getUsedDataKeys ? getUsedDataKeys(values.data) : [dataKey];
		}

		if (usedKeys.sort().toString() !== breakdownKeys.sort().toString()) {
			onChange(usedKeys.map(dataKey => ({
				attribute: null,
				dataKey,
				group: getDefaultSystemGroup()
			})));
		}
	};

	filterOptions = (filterByRef: boolean) => (options: Array<Attribute>, index: number = 0): Array<Attribute> => {
		const {filterAttributesByMain, helpers, index: dataSetIndex, onlyCommonAttributes, value} = this.props;
		let attributes = onlyCommonAttributes ? helpers.getCommonAttributes(options) : options;

		if (filterAttributesByMain && index > this.mainIndex) {
			attributes = helpers.filterBreakdownAttributeByMainDataSet(attributes, dataSetIndex);
		}

		if (!onlyCommonAttributes) {
			const {attribute} = value[index] ?? {};

			attributes = helpers.filterAttributesByUsed(attributes, dataSetIndex, [attribute]);
		}

		return attributes;
	};

	handleChangeGroup = (breakdownIndex: number) => (group: Group, attribute: Attribute) => {
		const {onChange, value} = this.props;
		const newBreakdown = value.map((item, i) => breakdownIndex === i ? {...item, attribute, group} : item);

		onChange(newBreakdown);
	};

	handleChangeLabel = ({value: attribute}: OnSelectEvent, breakdownIndex: number, callback?: Function) => {
		const {onChange, value: breakdown} = this.props;
		const newBreakdown = breakdown.map((item, i) => i === breakdownIndex ? {...item, attribute} : item);

		onChange(newBreakdown, callback);
	};

	handleClickAddButton = () => {
		if (!Array.isArray(this.props.value) || this.props.value.length === 0) {
			this.createNewBreakdown();
		}
	};

	handleSelect = (event: OnSelectEvent, breakdownIndex: number) => {
		const {onChange, value: breakdown} = this.props;
		const {attribute: prevAttribute} = breakdown[breakdownIndex];
		const {value: attribute} = event;
		const isMain = breakdownIndex === this.mainIndex;
		const typeIsChanged = !prevAttribute || prevAttribute.type !== attribute.type || prevAttribute.timerValue !== attribute.timerValue;
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

	renderAddButton = () => {
		const {value} = this.props;
		const active = !!value;

		return <ExtendButton active={active} onClick={this.handleClickAddButton} text={t('BreakdownFieldset::Breakdown')} />;
	};

	renderBreakdown = () => {
		const {value} = this.props;

		return value ? value.map(this.renderField) : null;
	};

	renderField = (item: BreakdownItem, breakdownIndex: number) => {
		const {index: dataSetIndex, isMain, onRemove, removable, required, values} = this.props;
		const {attribute} = item;
		const dataSet = values.data[dataSetIndex];
		const hasRemove = removable && !required;

		if (dataSet) {
			const {dataKey, source} = dataSet;
			const context: FieldContext = {
				breakdown: item,
				breakdownIndex,
				isMainSource: isMain,
				source: source.value
			};
			const components = {
				Field: this.renderGroupWithContext
			};

			return (
				<Context.Provider key={breakdownIndex} value={context}>
					<FormField path={getErrorPath(DIAGRAM_FIELDS.data, dataSetIndex, DIAGRAM_FIELDS.breakdown, breakdownIndex)}>
						<AttributeFieldset
							components={components}
							dataKey={dataKey}
							dataSetIndex={dataSetIndex}
							getMainOptions={this.filterOptions(false)}
							getRefOptions={this.filterOptions(true)}
							index={breakdownIndex}
							onChangeLabel={this.handleChangeLabel}
							onRemove={onRemove}
							onSelect={this.handleSelect}
							removable={hasRemove}
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
		const {breakdown, breakdownIndex, isMainSource, source} = context;
		const {attribute, group} = breakdown;
		const isNotMain = breakdownIndex !== this.mainIndex;
		const isNotRefAttr = attribute && !(attribute.type in ATTRIBUTE_SETS.REFERENCE);
		const disabled = Boolean(isNotMain && isNotRefAttr) || !isMainSource;

		return (
			<AttributeGroupField
				attribute={attribute}
				disabled={disabled}
				onChange={this.handleChangeGroup(breakdownIndex)}
				source={source}
				value={group}
			/>
		);
	};

	renderGroupWithContext = () => (
		<Context.Consumer>
			{context => this.renderGroup(context)}
		</Context.Consumer>
	);

	render () {
		const {className, disabled} = this.props;
		const CN = cn(className, {
			[styles.disabled]: disabled
		});

		return (
			<div className={CN}>
				{this.renderAddButton()}
				{this.renderBreakdown()}
			</div>
		);
	}
}

export default compose(withAttributesHelpers, withValues(DIAGRAM_FIELDS.data))(BreakdownFieldset);
