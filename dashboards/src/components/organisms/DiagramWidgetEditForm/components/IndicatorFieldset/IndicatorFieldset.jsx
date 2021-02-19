// @flow
import type {Attribute} from 'store/sources/attributes/types';
import AttributeAggregationField from 'DiagramWidgetEditForm/components/AttributeAggregationField';
import AttributeCreatingModal from 'components/organisms/AttributeCreatingModal';
import AttributeFieldset from 'DiagramWidgetEditForm/components/AttributeFieldset';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {ComputedAttr} from 'store/widgets/data/types';
import ComputedAttributeEditor from 'DiagramWidgetEditForm/components/ComputedAttributeEditor';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import FormField from 'DiagramWidgetEditForm/components/FormField';
import {getDefaultAggregation} from 'DiagramWidgetEditForm/components/AttributeAggregationField/helpers';
import type {Indicator} from 'containers/DiagramWidgetEditForm/types';
import type {OnSelectEvent} from 'components/types';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import withForm from 'DiagramWidgetEditForm/withForm';

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

	getModalSources = () => {
		const {attributes: map, fetchAttributes, values} = this.props;
		const sources = [];

		values.data.forEach(set => {
			const source = set[FIELDS.source];

			if (source) {
				const dataKey = set[FIELDS.dataKey];
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

	getSourceOptions = (options: Array<Attribute>) => [...this.props.values.computedAttrs, ...options];

	handleChangeLabel = ({value: attribute}: OnSelectEvent) => this.change({
		...this.props.value,
		attribute
	});

	handleClickCreationButton = () => this.setState({showCreatingModal: true});

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

	renderAggregation = (props: Object) => {
		const {usesNotApplicableAggregation, value: indicator} = this.props;
		const {aggregation, attribute} = indicator;
		const {catalogItem} = ATTRIBUTE_TYPES;
		let {value} = props;

		if (attribute && attribute.type === catalogItem) {
			value = attribute;
		}

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

	renderRefField = (props: Object) => {
		const {value} = props;

		if (value && value.type === ATTRIBUTE_TYPES.COMPUTED_ATTR) {
			return this.renderComputedAttributeEditor();
		}

		return this.renderAggregation(props);
	};

	render () {
		const {dataSet, dataSetIndex, error, index, onRemove, removable, value} = this.props;
		const {attribute} = value;

		return (
			<FormField error={error}>
				<AttributeFieldset
					dataSet={dataSet}
					dataSetIndex={dataSetIndex}
					getSourceOptions={this.getSourceOptions}
					index={index}
					onChangeLabel={this.handleChangeLabel}
					onClickCreationButton={this.handleClickCreationButton}
					onRemove={onRemove}
					onSelect={this.handleSelectIndicator}
					removable={removable}
					renderRefField={this.renderRefField}
					showCreationButton={true}
					value={attribute}
				/>
				{this.renderCreatingModal()}
			</FormField>
		);
	}
}

export default withForm(IndicatorFieldset);
