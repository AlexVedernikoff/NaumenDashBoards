// @flow
import type {Attribute} from 'store/sources/attributes/types';
import AttributeAggregationField from 'DiagramWidgetEditForm/components/AttributeAggregationField';
import AttributeCreatingModal from 'components/organisms/AttributeCreatingModal';
import AttributeFieldset from 'DiagramWidgetEditForm/components/AttributeFieldset';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {ComputedAttr} from 'store/widgets/data/types';
import ComputedAttributeEditor from 'DiagramWidgetEditForm/components/ComputedAttributeEditor';
import Container from 'components/atoms/Container';
import CreationPanel from 'components/atoms/CreationPanel';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import FormField from 'DiagramWidgetEditForm/components/FormField';
import {getDefaultAggregation} from 'DiagramWidgetEditForm/components/AttributeAggregationField/helpers';
import type {Indicator} from 'containers/DiagramWidgetEditForm/types';
import type {OnSelectEvent} from 'components/types';
import type {Props, State} from './types';
import type {Props as ContainerProps} from 'components/atoms/Container/types';
import React, {createContext, PureComponent} from 'react';
import withForm from 'DiagramWidgetEditForm/withForm';
import withGetComponents from 'components/HOCs/withGetComponents';

const Context: React$Context<Indicator> = createContext({
	aggregation: DEFAULT_AGGREGATION.COUNT,
	attribute: null
});

export class IndicatorFieldset extends PureComponent<Props, State> {
	static defaultProps = {
		usesNotApplicableAggregation: false
	};

	state = {
		showCreatingModal: false
	};

	change = (indicator: Indicator) => {
		const {dataSetIndex, index, onChange} = this.props;

		onChange(dataSetIndex, index, indicator);
	};

	getComponents = () => this.props.getComponents({
		Field: this.renderFieldWithContext,
		MenuContainer: this.renderMenuContainer
	});

	getMainOptions = (options: Array<Attribute>): Array<Attribute> => [...this.props.values.computedAttrs, ...options];

	getModalSources = () => {
		const {attributes: map, fetchAttributes, values} = this.props;
		const sources = [];

		values.data.forEach(dataSet => {
			const {value: source} = dataSet[FIELDS.source];

			if (source) {
				const dataKey = dataSet[FIELDS.dataKey];
				const classFqn = source.value;
				let {[classFqn]: sourceData = {
					error: false,
					loading: false,
					options: [],
					uploaded: false
				}} = map;
				const {error, loading, options: attributes, uploaded} = sourceData;

				if ((error || loading || uploaded) === false) {
					fetchAttributes(classFqn);
				}

				sources.push({
					attributes,
					dataKey,
					source
				});
			}
		});

		return sources;
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
				[FIELDS.aggregation]: getDefaultAggregation(attribute)
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

		setFieldValue(FIELDS.computedAttrs, values.computedAttrs.filter(a => a.code !== attribute.code));
	};

	saveComputedAttribute = (attribute: ComputedAttr) => {
		const {setFieldValue, values} = this.props;
		const {computedAttrs} = values;
		const attrIndex = computedAttrs.findIndex(attr => attr.code === attribute.code);

		if (attrIndex !== -1) {
			computedAttrs[attrIndex] = attribute;
		} else {
			computedAttrs.push(attribute);
		}

		setFieldValue(FIELDS.computedAttrs, computedAttrs);
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
					name={FIELDS.aggregation}
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
					sources={this.getModalSources()}
					value={attribute}
				/>
			);
		}
	};

	renderCreatingModal = () => {
		const {showCreatingModal} = this.state;

		if (showCreatingModal) {
			return (
				<AttributeCreatingModal
					onClose={this.handleCloseCreatingModal}
					onSubmit={this.handleSubmitCreatingModal}
					sources={this.getModalSources()}
				/>
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
		const {dataKey, dataSetIndex, error, index, onRemove, removable, source, value} = this.props;
		const {attribute} = value;

		return (
			<Context.Provider value={value}>
				<FormField error={error}>
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

export default withForm(withGetComponents(IndicatorFieldset));
