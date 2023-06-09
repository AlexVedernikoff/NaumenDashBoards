// @flow
import {addElement, deepClone, omit, replaceElement} from 'helpers';
import type {Attribute} from 'store/sources/attributes/types';
import AttributeAggregationField from 'WidgetFormPanel/components/AttributeAggregationField';
import AttributeCreatingModal from 'containers/AttributeCreatingModal';
import AttributeFieldset from 'WidgetFormPanel/components/AttributeFieldset';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {CALCULATE, DEFAULT_AGGREGATION} from 'src/store/widgets/constants';
import {compose} from 'redux';
import type {ComputedAttr, PercentageRelativeAttr} from 'store/widgets/data/types';
import ComputedAttributeEditor from 'WidgetFormPanel/components/ComputedAttributeEditor';
import Container from 'components/atoms/Container';
import CreationPanel from 'components/atoms/CreationPanel';
import type {DiagramDataSet, Indicator} from 'store/widgetForms/types';
import {DIAGRAM_FIELDS} from 'components/organisms/WidgetFormPanel/constants';
import FieldButton from 'components/atoms/FieldButton';
import type {FilterFormResult} from 'containers/FilterForm/types';
import FormField from 'WidgetFormPanel/components/FormField';
import {getDefaultAggregation} from 'WidgetFormPanel/components/AttributeAggregationField/helpers';
import {getErrorPath} from 'WidgetFormPanel/helpers';
import {getSourceAttribute} from 'store/sources/attributes/helpers';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import {isDontUseParamsForDataSet} from 'store/widgets/data/helpers';
import type {OnSelectEvent} from 'components/types';
import type {Props as ContainerProps} from 'components/atoms/Container/types';
import type {Props, State} from './types';
import React, {createContext, PureComponent} from 'react';
import SelectModal, {SelectItem} from 'components/molecules/SelectModal';
import SourcesAndFieldsExtended, {
	FIELD_TYPE
} from 'WidgetFormPanel/components/SourcesAndFieldsExtended';
import t from 'localization';
import uuid from 'tiny-uuid';
import {WIDGET_TYPES} from 'store/widgets/data/constants';
import withAttributesHelpers from 'containers/DiagramWidgetForm/HOCs/withAttributesHelpers';
import withFilterForm from 'containers/FilterForm';
import withType from 'WidgetFormPanel/HOCs/withType';
import withValues from 'components/organisms/WidgetForm/HOCs/withValues';

const Context: React$Context<Indicator> = createContext({
	aggregation: DEFAULT_AGGREGATION.COUNT,
	attribute: null
});

Context.displayName = 'INDICATOR_FIELDSET_CONTEXT';

export class IndicatorFieldset extends PureComponent<Props, State> {
	static defaultProps = {
		filteredSource: null,
		hasInterestRelative: false,
		usesNotApplicableAggregation: false
	};

	state = {
		showCreatingModal: false,
		showSelectionModal: false
	};

	change = (indicator: Indicator, callback?: Function) => {
		const {index, onChange} = this.props;
		return onChange(index, indicator, callback);
	};

	getChangeDataSetHandler = (index: number) => (dataSetIndex: number, dataSet: DiagramDataSet) => {
		const {onChangeDataSet} = this.props;

		if (onChangeDataSet) {
			onChangeDataSet(index, dataSetIndex, dataSet);
		}
	};

	getClickSourcePercentageRelativeHandler = () => {
		const handler = async () => {
			this.setState({showSelectionModal: false});

			const {openFilterForm, source} = this.props;
			const {descriptor, value} = source;

			if (value) {
				const {label} = value;
				const sourceData = {descriptor: descriptor ?? null, value};
				const filters: FilterFormResult = await openFilterForm(sourceData);

				if (filters.success && filters.descriptor) {
					const attribute: PercentageRelativeAttr = {
						code: uuid(),
						descriptor: filters.descriptor ?? '',
						title: `${label} - ${t('IndicatorFieldset::SourcePercentageRelativeField')}`,
						type: ATTRIBUTE_TYPES.PERCENTAGE_RELATIVE_ATTR
					};

					this.change({
						aggregation: DEFAULT_AGGREGATION.COUNT,
						attribute
					});
				}
			}
		};

		return () => { handler(); };
	};

	getEditPercentageRelativeAttributeHandler = (attribute: PercentageRelativeAttr | null) => {
		const handler = async () => {
			const {openFilterForm, source} = this.props;
			const {value} = source;

			if (attribute && source && value) {
				const descriptor = attribute.descriptor ?? source.descriptor ?? null;
				const sourceData = {descriptor, value};
				const filters = await openFilterForm(sourceData);

				if (filters.success && filters.descriptor) {
					const newAttribute = {...attribute, descriptor: filters.descriptor};

					this.change({
						...this.props.value,
						attribute: newAttribute
					});
				}
			}
		};

		return () => { handler(); };
	};

	getMainComponents = () => ({
		Field: this.renderFieldWithContext,
		FilterIcon: this.renderFilterIcon,
		MenuContainer: this.renderMenuContainer(true)
	});

	getMainOptions = (options: Array<Attribute>): Array<mixed> => {
		const {attributesHelpers, dataSetIndex, type, value, values} = this.props;

		const {attribute} = value;
		let filterAttribute: Array<?Attribute> = [];
		const sourceAttribute = getSourceAttribute(attribute);

		if (sourceAttribute) {
			filterAttribute = [sourceAttribute];
		}

		if (type.value === WIDGET_TYPES.TABLE) {
			values.data[dataSetIndex].indicators.forEach(({attribute}) => {
				const sourceAttribute = getSourceAttribute(attribute);

				if (sourceAttribute) {
					filterAttribute.push(sourceAttribute);
				}
			});
		}

		let attributes = attributesHelpers.filterAttributesByUsed(
			options,
			dataSetIndex,
			filterAttribute
		);

		if (dataSetIndex !== 0 && isDontUseParamsForDataSet(values.data[dataSetIndex])) {
			attributes = attributesHelpers.filterAttributeByMainDataSet(options, dataSetIndex);
		}

		return [...(values.computedAttrs ?? []), ...attributes];
	};

	getRefComponents = () => ({
		Field: this.renderFieldWithContext,
		MenuContainer: this.renderMenuContainer(false)
	});

	handleChangeLabel = (
		{value: attribute}: OnSelectEvent,
		index: number,
		callback?: Function
	) => this.change({
		...this.props.value,
		attribute
	}, callback);

	handleClickCreationPanel = () => {
		const {hasInterestRelative} = this.props;

		if (hasInterestRelative) {
			this.setState({showSelectionModal: true});
		} else {
			this.setState({showCreatingModal: true});
		}
	};

	handleClickFilter = async () => {
		const {filteredSource, openFilterForm, value: indicator} = this.props;

		if (filteredSource) {
			const {descriptor} = indicator;
			const {value} = filteredSource;

			if (value) {
				const sourceData = {descriptor: descriptor ?? '', value};
				const filterForm = await openFilterForm(sourceData);

				if (filterForm.success) {
					if (filterForm.descriptor) {
						this.change({...indicator, descriptor: filterForm.descriptor});
					} else {
						this.change(omit(indicator, 'descriptor'));
					}
				}
			}
		}
	};

	handleClickMathFormula = () => {
		this.setState({
			showCreatingModal: true,
			showSelectionModal: false
		});
	};

	handleCloseCreatingModal = () => this.setState({showCreatingModal: false});

	handleCloseSelectionModal = () => this.setState({showSelectionModal: false});

	handleRemoveComputedAttribute = (attribute: ComputedAttr) => {
		const {value} = this.props;

		this.removeComputedAttribute(attribute);
		this.change({...value, attribute: null});
	};

	handleSelectAggregation = (name: string, aggregation: string) => {
		if (aggregation === CALCULATE) {
			this.handleClickCreationPanel();
		} else {
			this.change({...this.props.value, aggregation});
		}
	};

	handleSelectIndicator = ({value: attribute}: OnSelectEvent) => {
		const {value} = this.props;
		const sourceAttribute = getSourceAttribute(attribute);
		let newIndicator = value;
		const {attribute: currentAttribute} = value;

		if (sourceAttribute) {
			const mustClearAggregation = !currentAttribute
			|| currentAttribute.type !== sourceAttribute.type
			|| (
				currentAttribute.timerValue
				&& sourceAttribute.timerValue
				&& currentAttribute.timerValue !== sourceAttribute.timerValue
			);

			if (mustClearAggregation) {
				newIndicator = {
					...newIndicator,
					aggregation: getDefaultAggregation(attribute)
				};
			}
		}

		this.change({...newIndicator, attribute: deepClone(attribute)});
	};

	handleSubmitCreatingModal = (attribute: ComputedAttr) => {
		const {value} = this.props;

		this.setState({showCreatingModal: false});

		this.saveComputedAttribute(attribute);
		this.change({...value, attribute});
	};

	removeComputedAttribute = (attribute: ComputedAttr) => {
		const {setFieldValue, values} = this.props;

		setFieldValue(
			DIAGRAM_FIELDS.computedAttrs,
			values.computedAttrs.filter(a => a.code !== attribute.code)
		);
	};

	saveComputedAttribute = (newAttribute: ComputedAttr) => {
		const {setFieldValue, value, values} = this.props;
		const {computedAttrs} = values;
		const attrIndex = computedAttrs.findIndex(attr => attr.code === newAttribute.code);
		let newComputedAttrs = computedAttrs;

		if (attrIndex === -1) {
			newComputedAttrs = addElement(newComputedAttrs, newAttribute);
		} else {
			newComputedAttrs = replaceElement(newComputedAttrs, attrIndex, newAttribute);
		}

		setFieldValue(DIAGRAM_FIELDS.computedAttrs, newComputedAttrs);
		this.change({...value, attribute: newAttribute});
	};

	renderAggregation = (indicator: Indicator) => {
		const {type, usesNotApplicableAggregation} = this.props;
		const {aggregation, attribute} = indicator;
		const {COMPUTED_ATTR, catalogItem} = ATTRIBUTE_TYPES;

		if (attribute?.type !== COMPUTED_ATTR) {
			const {REFERENCE} = ATTRIBUTE_SETS;
			// $FlowFixMe
			let value: Attribute = attribute;

			if (attribute && attribute.type in REFERENCE && attribute?.type !== catalogItem) {
				// $FlowFixMe
				value = attribute.ref;
			}

			const hasPercentAggregation = ![
				WIDGET_TYPES.SPEEDOMETER,
				WIDGET_TYPES.SUMMARY
			].includes(type.value);

			return (
				<AttributeAggregationField
					attribute={value}
					hasCreateCalculatedFieldButton={true}
					hasPercentAggregation={hasPercentAggregation}
					onSelect={this.handleSelectAggregation}
					tip={t('IndicatorFieldset::Aggregation')}
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

		return null;
	};

	renderCreatingModal = () => {
		const {showCreatingModal} = this.state;

		if (showCreatingModal) {
			return (
				<AttributeCreatingModal
					onClose={this.handleCloseCreatingModal}
					onSubmit={this.handleSubmitCreatingModal}
				/>
			);
		}
	};

	renderField = (indicator: Indicator) => {
		const {attribute} = indicator;

		if (attribute && attribute.type === ATTRIBUTE_TYPES.COMPUTED_ATTR) {
			return this.renderComputedAttributeEditor();
		}

		if (attribute && attribute.type === ATTRIBUTE_TYPES.PERCENTAGE_RELATIVE_ATTR) {
			return this.renderPercentageRelativeAttributeIcon();
		}

		return this.renderAggregation(indicator);
	};

	renderFieldWithContext = () => (
		<Context.Consumer>
			{indicator => this.renderField(indicator)}
		</Context.Consumer>
	);

	renderFilterIcon = () => {
		const {filteredSource, value} = this.props;

		if (filteredSource) {
			const {descriptor} = value;
			const icon = descriptor ? ICON_NAMES.FILLED_FILTER : ICON_NAMES.FILTER;

			return (
				<IconButton icon={icon} onClick={this.handleClickFilter} />
			);
		}

		return null;
	};

	renderMenuContainer = (isMain: boolean) => (props: ContainerProps) => {
		const {dataSets} = this.props;
		const {children, className} = props;

		if (isMain && dataSets) {
			return this.renderSourcesAndFields(className, children);
		}

		return (
			<Container className={className}>
				{children}
				<CreationPanel
					onClick={this.handleClickCreationPanel}
					text={t('IndicatorFieldset::CreateField')}
				/>
			</Container>
		);
	};

	renderPercentageRelativeAttributeIcon = () => {
		const {value} = this.props;
		const {attribute} = value;

		if (attribute && attribute.type === ATTRIBUTE_TYPES.PERCENTAGE_RELATIVE_ATTR) {
			return (
				<FieldButton onClick={this.getEditPercentageRelativeAttributeHandler(attribute)}>
					f(%)
				</FieldButton>
			);
		}

		return null;
	};

	renderSelectionModal = () => {
		const {showSelectionModal} = this.state;

		if (showSelectionModal) {
			return (
				<SelectModal onClose={this.handleCloseSelectionModal}>
					<SelectItem
						onClick={this.handleClickMathFormula}
						text='IndicatorFieldset::MathFormula'
					/>
					<SelectItem
						onClick={this.getClickSourcePercentageRelativeHandler()}
						text='IndicatorFieldset::SourcePercentageRelative'
					/>
				</SelectModal>
			);
		}
	};

	renderSourcesAndFields = (className: string, fieldSelectMainContainer: React$Node) => {
		const {dataSetIndex, dataSets, index, value} = this.props;
		const {attribute} = value;

		return (
			<SourcesAndFieldsExtended
				className={className}
				dataSetIndex={dataSetIndex}
				dataSets={dataSets}
				fieldType={FIELD_TYPE.INDICATOR}
				onChangeDataSet={this.getChangeDataSetHandler(index)}
				value={attribute}
			>
				{fieldSelectMainContainer}
				<CreationPanel
					onClick={this.handleClickCreationPanel}
					text={t('IndicatorFieldset::CreateField')}
				/>
			</SourcesAndFieldsExtended>
		);
	};

	render () {
		const {
			className,
			dataKey,
			dataSetIndex,
			index,
			onRemove,
			removable,
			source,
			value
		} = this.props;
		const {attribute} = value;

		return (
			<Context.Provider value={value}>
				<FormField
					className={className}
					path={getErrorPath(DIAGRAM_FIELDS.data, dataSetIndex, DIAGRAM_FIELDS.indicators, index)}
				>
					<AttributeFieldset
						components={this.getMainComponents()}
						dataKey={dataKey}
						dataSetIndex={dataSetIndex}
						getMainOptions={this.getMainOptions}
						index={index}
						onChangeLabel={this.handleChangeLabel}
						onRemove={onRemove}
						onSelect={this.handleSelectIndicator}
						refComponents={this.getRefComponents()}
						removable={removable}
						source={source}
						value={attribute}
					/>
					{this.renderCreatingModal()}
					{this.renderSelectionModal()}
				</FormField>
			</Context.Provider>
		);
	}
}

export default compose(
	withAttributesHelpers,
	withValues(DIAGRAM_FIELDS.computedAttrs, DIAGRAM_FIELDS.data),
	withType,
	withFilterForm
)(IndicatorFieldset);
