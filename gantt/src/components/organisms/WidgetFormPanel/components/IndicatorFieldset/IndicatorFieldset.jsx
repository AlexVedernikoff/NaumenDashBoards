// @flow
import type {Attribute} from 'store/sources/attributes/types';
import AttributeAggregationField from 'WidgetFormPanel/components/AttributeAggregationField';
import AttributeCreatingModal from 'containers/AttributeCreatingModal';
import AttributeFieldset from 'WidgetFormPanel/components/AttributeFieldset';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {compose} from 'recompose';
import type {ComputedAttr} from 'store/widgets/data/types';
import ComputedAttributeEditor from 'WidgetFormPanel/components/ComputedAttributeEditor';
import Container from 'components/atoms/Container';
import CreationPanel from 'components/atoms/CreationPanel';
import {DEFAULT_AGGREGATION} from 'src/store/widgets/constants';
import {DIAGRAM_FIELDS} from 'components/organisms/WidgetFormPanel/constants';
import FormField from 'WidgetFormPanel/components/FormField';
import {getDefaultAggregation} from 'WidgetFormPanel/components/AttributeAggregationField/helpers';
import {getErrorPath} from 'WidgetFormPanel/helpers';
import type {Indicator} from 'store/widgetForms/types';
import memoize from 'memoize-one';
import type {OnSelectEvent} from 'components/types';
import type {Props, State} from './types';
import type {Props as ContainerProps} from 'components/atoms/Container/types';
import React, {createContext, PureComponent} from 'react';
import withHelpers from 'containers/DiagramWidgetForm/HOCs/withHelpers';
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

	change = (indicator: Indicator) => {
		const {index, onChange} = this.props;

		onChange(index, indicator);
	};

	getComponents = memoize(() => ({
		Field: this.renderFieldWithContext,
		MenuContainer: this.renderMenuContainer
	}));

	getMainOptions = (options: Array<Attribute>): Array<mixed> => {
		const {dataSetIndex, helpers, values} = this.props;

		return [...values.computedAttrs, ...helpers.filterAttributesByUsed(options, dataSetIndex)];
	};

	handleChangeLabel = ({value: attribute}: OnSelectEvent) => this.change({
		...this.props.value,
		attribute
	});

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

		if (attribute && attribute.type !== ATTRIBUTE_TYPES.COMPUTED_ATTR && (!currentAttribute || currentAttribute.type !== attribute.type)) {
			newIndicator = {
				...newIndicator,
				aggregation: getDefaultAggregation(attribute)
			};
		}

		this.change({
			...newIndicator,
			attribute
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
		const {usesNotApplicableAggregation} = this.props;
		const {aggregation, attribute} = indicator;
		const {COMPUTED_ATTR, catalogItem} = ATTRIBUTE_TYPES;

		if (attribute?.type !== COMPUTED_ATTR) {
			const {REFERENCE} = ATTRIBUTE_SETS;
			// $FlowFixMe
			const value: Attribute = attribute && attribute.type in REFERENCE && attribute?.type !== catalogItem ? attribute.ref : attribute;

			return (
				<AttributeAggregationField
					attribute={value}
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
			{(indicator) => this.renderField(indicator)}
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
		const {dataKey, dataSetIndex, index, onRemove, removable, source, value} = this.props;
		const {attribute} = value;

		return (
			<Context.Provider value={value}>
				<FormField path={getErrorPath(DIAGRAM_FIELDS.data, dataSetIndex, DIAGRAM_FIELDS.indicators, index)}>
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

export default compose(withHelpers, withValues(DIAGRAM_FIELDS.computedAttrs))(IndicatorFieldset);
