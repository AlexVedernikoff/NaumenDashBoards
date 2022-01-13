// @flow
import type {Attribute} from 'store/sources/attributes/types';
import AttributeAggregationField from 'WidgetFormPanel/components/AttributeAggregationField';
import AttributeCreatingModal from 'containers/AttributeCreatingModal';
import AttributeFieldset from 'WidgetFormPanel/components/AttributeFieldset';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {compose} from 'redux';
import type {ComputedAttr} from 'store/widgets/data/types';
import ComputedAttributeEditor from 'WidgetFormPanel/components/ComputedAttributeEditor';
import Container from 'components/atoms/Container';
import CreationPanel from 'components/atoms/CreationPanel';
import {deepClone} from 'helpers';
import {DEFAULT_AGGREGATION} from 'src/store/widgets/constants';
import {DIAGRAM_FIELDS} from 'components/organisms/WidgetFormPanel/constants';
import FormField from 'WidgetFormPanel/components/FormField';
import {getDefaultAggregation} from 'WidgetFormPanel/components/AttributeAggregationField/helpers';
import {getErrorPath} from 'WidgetFormPanel/helpers';
import type {Indicator} from 'store/widgetForms/types';
import memoize from 'memoize-one';
import type {OnSelectEvent} from 'components/types';
import type {Props as ContainerProps} from 'components/atoms/Container/types';
import type {Props, State} from './types';
import React, {createContext, PureComponent} from 'react';
import {WIDGET_TYPES} from 'store/widgets/data/constants';
import withHelpers from 'containers/DiagramWidgetForm/HOCs/withHelpers';
import withType from 'WidgetFormPanel/HOCs/withType';
import withValues from 'components/organisms/WidgetForm/HOCs/withValues';

const Context: React$Context<Indicator> = createContext({
	aggregation: DEFAULT_AGGREGATION.COUNT,
	attribute: null
});

Context.displayName = 'INDICATOR_FIELDSET_CONTEXT';

export class IndicatorFieldset extends PureComponent<Props, State> {
	static defaultProps = {
		usesNotApplicableAggregation: false
	};

	state = {
		showCreatingModal: false
	};

	change = (indicator: Indicator, callback?: Function) => {
		const {index, onChange} = this.props;
		return onChange(index, indicator, callback);
	};

	getComponents = memoize(() => ({
		Field: this.renderFieldWithContext,
		MenuContainer: this.renderMenuContainer
	}));

	getMainOptions = (options: Array<Attribute>): Array<mixed> => {
		const {dataSetIndex, helpers, type, value, values} = this.props;

		const {attribute} = value;
		let filterAttribute: Array<?Attribute> = [];

		if (attribute && attribute.type !== ATTRIBUTE_TYPES.COMPUTED_ATTR) {
			filterAttribute = [attribute];
		}

		if (type.value === WIDGET_TYPES.TABLE) {
			values.data[dataSetIndex].indicators.forEach(({attribute}) => {
				if (attribute && attribute.type !== ATTRIBUTE_TYPES.COMPUTED_ATTR) {
					filterAttribute.push(attribute);
				}
			});
		}

		return [...values.computedAttrs, ...helpers.filterAttributesByUsed(options, dataSetIndex, filterAttribute)];
	};

	handleChangeLabel = ({value: attribute}: OnSelectEvent, index: number, callback?: Function) => this.change({
		...this.props.value,
		attribute
	}, callback);

	handleClickCreationPanel = () => this.setState({showCreatingModal: true});

	handleCloseCreatingModal = () => this.setState({showCreatingModal: false});

	handleRemoveComputedAttribute = (attribute: ComputedAttr) => {
		const {value} = this.props;

		this.removeComputedAttribute(attribute);
		this.change({
			...value,
			attribute: null
		});
	};

	handleSelectAggregation = (name: string, aggregation: string) => this.change({
		...this.props.value,
		aggregation
	});

	handleSelectIndicator = ({value: attribute}: OnSelectEvent) => {
		const {value} = this.props;
		let newIndicator = value;
		const {attribute: currentAttribute} = value;

		if (attribute && attribute.type !== ATTRIBUTE_TYPES.COMPUTED_ATTR) {
			const mustClearAggregation = !currentAttribute
			|| currentAttribute.type !== attribute.type
			|| (currentAttribute.timerValue && attribute.timerValue && currentAttribute.timerValue !== attribute.timerValue);

			if (mustClearAggregation) {
				newIndicator = {
					...newIndicator,
					aggregation: getDefaultAggregation(attribute)
				};
			}
		}

		this.change({
			...newIndicator,
			attribute: deepClone(attribute)
		});
	};

	handleSubmitCreatingModal = (attribute: ComputedAttr) => {
		const {value} = this.props;

		this.setState({showCreatingModal: false});

		this.saveComputedAttribute(attribute);
		this.change({
			...value,
			attribute
		});
	};

	removeComputedAttribute = (attribute: ComputedAttr) => {
		const {setFieldValue, values} = this.props;

		setFieldValue(DIAGRAM_FIELDS.computedAttrs, values.computedAttrs.filter(a => a.code !== attribute.code));
	};

	saveComputedAttribute = (newAttribute: ComputedAttr) => {
		const {setFieldValue, value, values} = this.props;
		const {computedAttrs} = values;
		const attrIndex = computedAttrs.findIndex(attr => attr.code === newAttribute.code);
		let newComputedAttrs = computedAttrs;

		if (attrIndex !== -1) {
			newComputedAttrs = newComputedAttrs.map((attr, i) => i === attrIndex ? newAttribute : attr);
		} else {
			newComputedAttrs = [...newComputedAttrs, newAttribute];
		}

		setFieldValue(DIAGRAM_FIELDS.computedAttrs, newComputedAttrs);
		this.change({
			...value,
			attribute: newAttribute
		});
	};

	renderAggregation = (indicator: Indicator) => {
		const {type, usesNotApplicableAggregation} = this.props;
		const {aggregation, attribute} = indicator;
		const {COMPUTED_ATTR, catalogItem} = ATTRIBUTE_TYPES;

		if (attribute?.type !== COMPUTED_ATTR) {
			const {REFERENCE} = ATTRIBUTE_SETS;
			// $FlowFixMe
			const value: Attribute = attribute && attribute.type in REFERENCE && attribute?.type !== catalogItem ? attribute.ref : attribute;
			const hasPercentAggregation = ![WIDGET_TYPES.SPEEDOMETER, WIDGET_TYPES.SUMMARY].includes(type.value);

			return (
				<AttributeAggregationField
					attribute={value}
					hasPercentAggregation={hasPercentAggregation}
					onSelect={this.handleSelectAggregation}
					tip="Агрегация"
					usesNotApplicableAggregation={usesNotApplicableAggregation}
					value={aggregation}
				/>
			);
		}

		return null;
	};

	renderComputedAttributeEditor = () => {
		const {value} = this.props;
		const {attribute} = value;

		if (attribute && attribute.type === ATTRIBUTE_TYPES.COMPUTED_ATTR) {
			return (
				<ComputedAttributeEditor
					onRemove={this.handleRemoveComputedAttribute}
					onSubmit={this.saveComputedAttribute}
					value={attribute}
				/>
			);
		}
	};

	renderCreatingModal = () => {
		const {showCreatingModal} = this.state;

		if (showCreatingModal) {
			return (
				<AttributeCreatingModal onClose={this.handleCloseCreatingModal} onSubmit={this.handleSubmitCreatingModal} />
			);
		}
	};

	renderField = (indicator: Indicator) => {
		const {attribute} = indicator;

		if (attribute && attribute.type === ATTRIBUTE_TYPES.COMPUTED_ATTR) {
			return this.renderComputedAttributeEditor();
		}

		return this.renderAggregation(indicator);
	};

	renderFieldWithContext = () => (
		<Context.Consumer>
			{indicator => this.renderField(indicator)}
		</Context.Consumer>
	);

	renderMenuContainer = (props: ContainerProps) => {
		const {children, className} = props;

		return (
			<Container className={className}>
				{children}
				<CreationPanel onClick={this.handleClickCreationPanel} text="Создать поле" />
			</Container>
		);
	};

	render () {
		const {className, dataKey, dataSetIndex, index, onRemove, removable, source, value} = this.props;
		const {attribute} = value;

		return (
			<Context.Provider value={value}>
				<FormField className={className} path={getErrorPath(DIAGRAM_FIELDS.data, dataSetIndex, DIAGRAM_FIELDS.indicators, index)}>
					<AttributeFieldset
						components={this.getComponents()}
						dataKey={dataKey}
						dataSetIndex={dataSetIndex}
						getMainOptions={this.getMainOptions}
						index={index}
						onChangeLabel={this.handleChangeLabel}
						onRemove={onRemove}
						onSelect={this.handleSelectIndicator}
						removable={removable}
						source={source}
						value={attribute}
					/>
					{this.renderCreatingModal()}
				</FormField>
			</Context.Provider>
		);
	}
}

export default compose(withHelpers, withValues(DIAGRAM_FIELDS.computedAttrs, DIAGRAM_FIELDS.data), withType)(IndicatorFieldset);
