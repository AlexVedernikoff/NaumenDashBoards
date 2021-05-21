// @flow
import type {Attribute} from 'store/sources/attributes/types';
import Checkbox from 'components/atoms/LegacyCheckbox';
import type {Components as TreeSelectComponents, TreeSelectLabelContainerProps} from 'components/molecules/TreeSelect/types';
import {DEFAULT_INDICATOR, DEFAULT_PARAMETER} from 'store/widgetForms/constants';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import type {DivRef, OnSelectEvent} from 'components/types';
import {DYNAMIC_ATTRIBUTE_PROPERTY} from 'store/sources/attributes/constants';
import FieldError from 'src/components/atoms/FieldError';
import FormField from 'WidgetFormPanel/components/FormField';
import {getDefaultAggregation} from 'WidgetFormPanel/components/AttributeAggregationField/helpers';
import {getDefaultBreakdown} from 'store/widgetForms/helpers';
import {getErrorPath} from 'WidgetFormPanel/helpers';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import IconButton from 'components/atoms/IconButton';
import LabelEditingForm from 'components/molecules/InputForm';
import {MODE} from './constraints';
import type {Props, State} from './types';
import React, {Component, createRef} from 'react';
import SavedFilters from 'WidgetFormPanel/components/SavedFilters';
import type {SourceData} from 'store/widgetForms/types';
import type {SourceFiltersItem} from 'store/sources/sourcesFilters/types';
import styles from './styles.less';
import TreeSelect from 'components/molecules/TreeSelect';
import {withCommonDialog} from 'containers/CommonDialogs/withCommonDialog';

export class SourceFieldset extends Component<Props, State> {
	static defaultProps = {
		parentClassFqn: null,
		removable: true,
		usesFilter: true
	};

	state = {
		error: null,
		mode: null,
		showEditForm: false
	};

	sourceSelectRef: DivRef = createRef();
	sourceSelectComponents: ?TreeSelectComponents = null;

	componentDidMount () {
		const {index, value: {source}} = this.props;

		if (!source.value && index > 0) {
			this.sourceSelectRef.current && this.sourceSelectRef.current.scrollIntoView({behavior: 'smooth'});
		}
	}

	componentDidUpdate (prevProps: Props) {
		const {descriptor, value: sourceValue} = this.props.value.source;
		const {descriptor: prevDescriptor, value: prevSourceValue} = prevProps.value.source;

		if (sourceValue && sourceValue.value !== prevSourceValue?.value) {
			this.resetAttributes();
		}

		if (descriptor !== prevDescriptor) {
			this.resetDynamicAttributes();
		}
	}

	callFilterModal = async () => {
		const {onOpenFilterForm, value} = this.props;
		const context = await onOpenFilterForm();

		if (context) {
			this.changeSource({
				...value.source,
				descriptor: context,
				filterId: null
			});
		}
	};

	changeSource = (source: SourceData) => {
		const {index, onChange, value} = this.props;

		onChange(index, {...value, source});
	};

	getSourceSelectComponents = (): TreeSelectComponents => {
		if (!this.sourceSelectComponents) {
			this.sourceSelectComponents = {
				IndicatorsContainer: this.renderSourceSelectIndicators,
				LabelContainer: this.renderSourceSelectLabel
			};
		}

		return this.sourceSelectComponents;
	};

	handleChangeCompute = (name: string, sourceForCompute: boolean) => {
		const {index, onChange, value} = this.props;

		onChange(index, {
			...value,
			sourceForCompute
		});
	};

	handleChangeFilterLabel = async (label: string): Promise<void> => {
		const {filterList, onUpdateSourcesFilter, value: {source}} = this.props;
		const {mode} = this.state;
		let error = null;

		if (!filterList.find(filter => filter.label === label)) {
			if (source.value) {
				const {descriptor, filterId, value} = source;

				if (descriptor) {
					const id = mode === MODE.SAVE ? null : filterId;
					const data = await onUpdateSourcesFilter(value.value, {descriptor, id, label});

					if (data.result) {
						const {filterId} = data;

						this.changeSource({...source, filterId, value: {...value, label}});
						this.hideEditForm();
					} else {
						error = data.message;
					}
				} else {
					this.changeSource({...source, value: { ...value, label }});
					this.hideEditForm();
				}
			}
		} else {
			error = 'Название фильтра должно быть уникально';
		}

		this.setInnerError(error);
	};

	handleClickRemoveButton = () => {
		const {index, onRemove} = this.props;

		onRemove(index);
	};

	handleDeleteSavedFilters = (id: string) => {
		const {onDeleteSourcesFilter, value: {source}} = this.props;

		if (source.value) {
			onDeleteSourcesFilter(source.value.value, id);
		}
	};

	handleRemoveSource = () => this.changeSource({
		...this.props.value.source,
		descriptor: '',
		filterId: null,
		value: null
	});

	handleSelect = ({value: newRawSourceValue}: OnSelectEvent) => {
		const {onFetchAttributes, parentClassFqn, value} = this.props;
		const {source} = value;
		const {value: sourceValue} = source;
		let newSource = source;

		const newSourceValue = newRawSourceValue
			? { label: newRawSourceValue.label, value: newRawSourceValue.value }
			: newRawSourceValue;

		if (newSourceValue?.value !== sourceValue?.value) {
			newSource = {
				...newSource,
				descriptor: '',
				filterId: null,
				widgetFilterOptions: []
			};

			newSourceValue && onFetchAttributes(newSourceValue.value, parentClassFqn, this.setDefaultIndicator);
		}

		this.changeSource({
			...newSource,
			value: newSourceValue
		});
	};

	handleSelectFilters = async (sourceFilter: SourceFiltersItem) => {
		const {confirm, onCheckApplyFilter, value: dataSet} = this.props;
		const {id, label} = sourceFilter;
		const {value} = dataSet.source;

		if (value) {
			const approvalToApply = await onCheckApplyFilter(value.value, sourceFilter);

			if (
				approvalToApply.result
				|| await confirm(
				'Ошибка применения фильтра',
				'Выбранный фильтр не может быть применен полностью, т.к. содержит условия, связанные с текущим объектом. Применить частично?'
				)
			) {
				this.changeSource({
					...dataSet.source,
					filterId: id ?? null,
					value: {
						...value,
						label
					}
				});
			}
		}
	};

	hideEditForm = () => this.setState({mode: null, showEditForm: false});

	isCurrentFilterChanged = (): boolean => {
		const {filterList = [], value: {source}} = this.props;
		const {descriptor} = source;

		if (source.filterId) {
			const usedFilter = filterList.find(filter => filter.id === source.filterId);

			return descriptor === usedFilter?.descriptor;
		} else if (descriptor) {
			return !!JSON.parse(descriptor).filters;
		}

		return false;
	};

	isDynamicAttribute = (attribute: ?Attribute) => attribute?.property === DYNAMIC_ATTRIBUTE_PROPERTY;

	resetAttributes = () => {
		const {index, onChange, value} = this.props;
		const {breakdown, dataKey, parameters} = value;
		const newValue = {
			...value,
			breakdown: breakdown ? getDefaultBreakdown(dataKey) : breakdown,
			indicators: [DEFAULT_INDICATOR],
			parameters: parameters ? [DEFAULT_PARAMETER] : parameters
		};

		onChange(index, newValue);
	};

	resetDynamicAttribute = (data: Object) => {
		const {attribute, ...rest} = data;

		return {
			...rest,
			attribute: this.isDynamicAttribute(attribute) ? null : attribute
		};
	};

	resetDynamicAttributes = () => {
		const {index, onChange, value} = this.props;
		const {breakdown, indicators, parameters} = value;

		const newValue = {
			...value,
			breakdown: breakdown?.map(this.resetDynamicAttribute),
			indicators: indicators.map(this.resetDynamicAttribute),
			parameters: parameters?.map(this.resetDynamicAttribute)
		};

		onChange(index, newValue);
	};

	setDefaultIndicator = (attributes: Array<Attribute>) => {
		const {index, onChange, value} = this.props;
		const attribute = attributes.find(attribute => attribute.code === 'UUID') ?? null;
		const newValue = {
			...value,
			indicators: [{
					aggregation: getDefaultAggregation(attribute),
					attribute
			}]
		};

		onChange(index, newValue);
	};

	setInnerError = (error: ?string) => this.setState({error});

	showEditForm = () => this.setState({mode: MODE.EDIT, showEditForm: true});

	showSaveForm = () => this.setState({mode: MODE.SAVE, showEditForm: true});

	renderComputeCheckbox = () => {
		const {value} = this.props;
		const {sourceForCompute} = value;

		return <Checkbox label="Только для вычислений" onClick={this.handleChangeCompute} value={sourceForCompute} />;
	};

	renderFilterButton = (): React$Node => {
		const {usesFilter, value} = this.props;
		const {FILLED_FILTER, FILTER} = ICON_NAMES;
		const {descriptor, filterId} = value.source;
		const active = !!filterId || JSON.parse(descriptor || '{}').filters?.length > 0;
		const iconName = active ? FILLED_FILTER : FILTER;

		if (usesFilter) {
			return (
				<div className={styles.filterButton} onClick={this.callFilterModal}>
					<Icon name={iconName} />
				</div>
			);
		}

		return null;
	};

	renderLabelEditingForm = (): React$Node => {
		const {value: {source: {value}}} = this.props;
		const {showEditForm} = this.state;

		if (showEditForm) {
			const {label = ''} = value ?? {};

			return (
				<div className={styles.sourceSelectLabelEdit}>
					<LabelEditingForm
						onClose={this.hideEditForm}
						onSubmit={this.handleChangeFilterLabel}
						value={label}
					/>
				</div>
			);
		}

		return null;
	};

	renderRemoveButton = () => {
		const {removable} = this.props;

		if (removable) {
			return (
				<button className={styles.removeButton} onClick={this.handleClickRemoveButton} type="button">
					удалить
				</button>
			);
		}
	};

	renderSavedFiltersButton = (): React$Node => {
		const {filterList, filtersListLoading, usesFilter} = this.props;

		if (usesFilter && filterList && filterList.length > 0) {
			return (
				<FormField small>
					<SavedFilters
						filters={filterList}
						loading={filtersListLoading}
						onDelete={this.handleDeleteSavedFilters}
						onSelect={this.handleSelectFilters}
					/>
				</FormField>
			);
		}

		return null;
	};

	renderSourceSelect = (): React$Node => {
		const {index} = this.props;
		const {error, showEditForm} = this.state;

		const component = showEditForm ? this.renderLabelEditingForm() : this.renderSourceTreeSelect();

		return (
			<FormField path={getErrorPath(DIAGRAM_FIELDS.data, index, DIAGRAM_FIELDS.source)} small>
				<div className={styles.combinedContainer}>
					{this.renderFilterButton()}
					{component}
				</div>
				<FieldError text={error} />
			</FormField>
		);
	};

	renderSourceSelectIndicators = (props): React$Node => {
		const {className, onClick} = props;
		const isChanged = this.isCurrentFilterChanged();

		const editButton = isChanged
			? (<IconButton icon={ICON_NAMES.SAVE} onClick={this.showSaveForm} />)
			: (<IconButton icon={ICON_NAMES.EDIT} onClick={this.showEditForm} />);

		return (
			<div className={className} onClick={onClick}>
				{editButton}
				<IconButton icon={ICON_NAMES.REMOVE} onClick={this.handleRemoveSource} />
			</div>
		);
	};

	renderSourceSelectLabel = (props: TreeSelectLabelContainerProps): React$Node => {
		const {className, value} = props;
		const {label = ''} = value ?? {};
		const isChanged = this.isCurrentFilterChanged();

		return (
			<div className={styles.sourceSelectLabel}>
				{isChanged && <div className={styles.unsaveMarker}>*</div>}
				<div className={className} title={label}>{label}</div>
			</div>
		);
	};

	renderSourceTreeSelect = (): React$Node => {
		const {index, sources, value: {source}} = this.props;
		const {value: sourceValue} = source;

		let initialSelected;

		if (sourceValue) {
			initialSelected = [sourceValue.value];
		}

		const components = this.getSourceSelectComponents();
		const isActive = !source.value && index > 0;

		return (
			<TreeSelect
				className={styles.sourceTreeSelect}
				components={components}
				initialSelected={initialSelected}
				isActive={isActive}
				onSelect={this.handleSelect}
				options={sources}
				removable={true}
				value={sourceValue}
			/>
		);
	};

	render () {
		return (
			<div className={styles.container} ref={this.sourceSelectRef}>
				{this.renderSourceSelect()}
				{this.renderRemoveButton()}
				{this.renderComputeCheckbox()}
				{this.renderSavedFiltersButton()}
			</div>
		);
	}
}

export default withCommonDialog(SourceFieldset);
