// @flow
import type {Attribute} from 'store/sources/attributes/types';
import Checkbox from 'components/atoms/Checkbox';
import cn from 'classnames';
import type {ContainerProps} from 'components/molecules/TreeSelect/types';
import {DEFAULT_INDICATOR, DEFAULT_PARAMETER} from 'store/widgetForms/constants';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import {DYNAMIC_ATTRIBUTE_PROPERTY} from 'store/sources/attributes/constants';
import FieldError from 'src/components/atoms/FieldError';
import FormControl from 'components/molecules/FormControl';
import FormField from 'WidgetFormPanel/components/FormField';
import {getDefaultAggregation} from 'WidgetFormPanel/components/AttributeAggregationField/helpers';
import {getDefaultBreakdown, parseAttrSetConditions} from 'store/widgetForms/helpers';
import {getErrorPath} from 'WidgetFormPanel/helpers';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import IconButton from 'components/atoms/IconButton';
import {isDontUseParamsForDataSet} from 'store/widgetForms/tableForm/helpers';
import LabelEditingForm from 'components/molecules/InputForm';
import memoize from 'memoize-one';
import {MODE} from './constraints';
import type {OnChangeEvent, OnSelectEvent, Ref} from 'components/types';
import type {Props, State} from './types';
import React, {Component, createRef} from 'react';
import SavedFilters from 'WidgetFormPanel/components/SavedFilters';
import type {SourceData} from 'store/widgetForms/types';
import type {SourceFiltersItem} from 'store/sources/sourcesFilters/types';
import styles from './styles.less';
import T from 'components/atoms/Translation';
import t from 'localization';
import TreeSelect from 'components/molecules/TreeSelect';
import {withCommonDialog} from 'containers/CommonDialogs/withCommonDialog';

export class SourceFieldset extends Component<Props, State> {
	static defaultProps = {
		autoFillIndicators: true,
		parentClassFqn: null,
		removable: true,
		showSourceRowName: false,
		usesFilter: true
	};

	state = {
		error: null,
		hasFilter: false,
		mode: null,
		showEditForm: false
	};

	containerRef: Ref<'div'> = createRef();
	selectRef: Ref<typeof TreeSelect> = createRef();

	componentDidMount () {
		const {autoSelectFirstItem, index, value: {source}} = this.props;

		if (!source.value) {
			if (autoSelectFirstItem) {
				this.handleAutoSelectFirstItem();
			} else if (index > 0) {
				const {current: container} = this.containerRef;
				const {current: select} = this.selectRef;

				container && container.scrollIntoView({behavior: 'smooth'});
				select && select.setState({showMenu: true});
			}
		}
	}

	componentDidUpdate (prevProps: Props) {
		const {autoSelectFirstItem, sources, value: propsValue} = this.props;
		const {value} = propsValue.source;
		const {value: prevValue} = prevProps.value.source;

		if (value?.value !== prevValue?.value) {
			this.resetDynamicAttributes();
		}

		if (!value && autoSelectFirstItem && sources !== prevProps.sources) {
			this.handleAutoSelectFirstItem();
		}
	}

	callFilterModal = async () => {
		const {onOpenFilterForm, value} = this.props;
		const filters = await onOpenFilterForm();

		if (filters.success) {
			const hasFilter = filters.descriptor !== null;

			this.setState({hasFilter});
			this.changeSource({
				...value.source,
				descriptor: filters.descriptor,
				filterId: null
			});
		}
	};

	changeSource = (source: SourceData, callback?: Function) => {
		const {index, onChange, value} = this.props;

		onChange(index, {...value, source}, callback);
	};

	handleAutoSelectFirstItem = () => {
		const {sources} = this.props;
		const keys = Object.keys(sources);

		if (keys.length > 0) {
			const source = sources[keys[0]];

			this.handleSelect({name: '', value: source});
		}
	};

	getSourceSelectComponents = memoize(() => ({
		IndicatorsContainer: this.renderSourceSelectIndicators,
		LabelContainer: this.renderSourceSelectLabel
	}));

	handleChangeCompute = ({name, value: sourceForCompute}: OnChangeEvent<boolean>) => {
		const {index, onChange, value} = this.props;
		const {indicators} = value;

		onChange(index, {
			...value,
			indicators: sourceForCompute ? indicators || [DEFAULT_INDICATOR] : indicators,
			sourceForCompute: !sourceForCompute
		});
	};

	handleChangeFilterLabel = async (label: string, callback?: Function): Promise<void> => {
		const {filterList, onUpdateSourcesFilter, value: {source}} = this.props;
		const {mode} = this.state;
		let error = null;

		if (source.value) {
			const {descriptor, filterId, value} = source;

			if (mode === MODE.EDIT && filterId === null) {
				this.changeSource({...source, value: {...value, label}}, callback);
				this.hideEditForm();
			} else {
				if (!filterList.find(filter => filter.label === label) || mode === MODE.EDIT) {
					if (descriptor) {
						const data = await onUpdateSourcesFilter(value.value, {descriptor, id: filterId, label});

						if (data.result) {
							const {filterId} = data;

							this.changeSource({...source, filterId, value: {...value, label}}, callback);
							this.hideEditForm();
						} else {
							error = data.message;
						}
					}
				} else {
					error = t('SourceFieldset::ChangeFilterDuplicate', {name: label});
				}
			}
		}

		this.setInnerError(error);
	};

	handleClickRemoveButton = () => {
		const {index, onRemove} = this.props;

		onRemove(index);
	};

	handleDeleteSavedFilters = async (id: string) => {
		const {onDeleteSourcesFilter, value: {source}} = this.props;
		let error = null;

		if (source.value) {
			const data = await onDeleteSourcesFilter(source.value.value, id);

			if (!data.result) {
				error = t('SourceFieldset::DeleteSavedFilterError');
			}
		}

		this.setInnerError(error);
	};

	handleRemoveSource = () => this.changeSource({
		...this.props.value.source,
		descriptor: '',
		filterId: null,
		value: null
	});

	handleSelect = async ({value: node}: OnSelectEvent) => {
		const {onFetchAttributes, parentClassFqn, value} = this.props;
		const {source} = value;
		const {value: sourceValue} = source;
		const {value: nodeValue} = node;
		let newSource = source;

		const newSourceValue = nodeValue
			? {label: nodeValue.label, value: nodeValue.value}
			: nodeValue;

		if (newSourceValue?.value !== sourceValue?.value) {
			const attrSetConditions = await parseAttrSetConditions(nodeValue);

			newSource = {
				...newSource,
				descriptor: nodeValue.descriptor ?? '',
				filterId: null,
				widgetFilterOptions: []
			};

			if (newSourceValue) {
				onFetchAttributes(newSourceValue.value, parentClassFqn, attrSetConditions, attributes => { this.updateAttributes(attributes); });
			}
		}

		this.changeSource({
			...newSource,
			value: newSourceValue
		});
	};

	handleSelectFilters = async (sourceFilter: SourceFiltersItem) => {
		const {clearDynamicAttributeGroups, confirm, onCheckApplyFilter, value: dataSet} = this.props;
		const {id, label} = sourceFilter;
		const {value} = dataSet.source;

		if (value) {
			const approvalToApply = await onCheckApplyFilter(value.value, sourceFilter);

			if (
				approvalToApply.result
				|| await confirm(
					t('SourceFieldset::ConfirmFilterTitle'),
					t('SourceFieldset::ConfirmFilterMessage'),
					{relativeElement: this.containerRef}
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
				clearDynamicAttributeGroups(dataSet.dataKey);
			}
		}
	};

	handleSetSourceRowName = ({name, value}: OnChangeEvent<boolean>) => {
		const {index, onChange, value: dataSet} = this.props;
		const sourceRowName = value ? null : '';

		onChange(index, {...dataSet, sourceRowName});
	};

	hideEditForm = () => this.setState({error: null, mode: null, showEditForm: false});

	isCurrentFilterChanged = (): boolean => {
		const {value: {source}} = this.props;
		const {hasFilter} = this.state;

		return source.filterId === null && hasFilter;
	};

	isDynamicAttribute = (attribute: ?Attribute) => attribute?.property === DYNAMIC_ATTRIBUTE_PROPERTY;

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
		const newValue = {...value};

		if (breakdown) {
			newValue.breakdown = breakdown.map(this.resetDynamicAttribute);
		}

		if (indicators) {
			newValue.indicators = indicators.map(this.resetDynamicAttribute) ?? [DEFAULT_INDICATOR];
		}

		if (parameters) {
			newValue.parameters = parameters.map(this.resetDynamicAttribute);
		}

		onChange(index, newValue);
	};

	setInnerError = (error: ?string) => this.setState({error});

	showEditForm = () => this.setState({mode: MODE.EDIT, showEditForm: true});

	showSaveForm = () => this.setState({mode: MODE.SAVE, showEditForm: true});

	updateAttributes = async (attributes: Array<Attribute>) => {
		const {autoFillIndicators, fetchAttributesByCode, index, onChange, value} = this.props;
		const {breakdown, dataKey, parameters, source} = value;
		const classFqn = source.value?.value;
		const newValue = {...value};

		if (autoFillIndicators) {
			const attribute = attributes.find(attribute => attribute.code === 'UUID') ?? null;
			const indicators = [];

			if (attribute) {
				indicators.push({
					aggregation: getDefaultAggregation(attribute),
					attribute
				});
			} else {
				indicators.push(DEFAULT_INDICATOR);
			}

			newValue.indicators = indicators;
		}

		if (breakdown) {
			const defaultBreakdown = getDefaultBreakdown(dataKey)[0];

			newValue.breakdown = await fetchAttributesByCode(classFqn, breakdown, defaultBreakdown);
		}

		if (parameters) {
			newValue.parameters = await fetchAttributesByCode(classFqn, parameters, DEFAULT_PARAMETER);
		}

		onChange(index, newValue);
	};

	renderComputeCheckbox = () => {
		const {value} = this.props;
		const {sourceForCompute} = value;

		return (
			<FormControl label={t('SourceFieldset::ComputeCheckbox')}>
				<Checkbox
					checked={sourceForCompute}
					className={styles.sourceForCompute}
					onChange={this.handleChangeCompute}
					value={sourceForCompute}
				/>
			</FormControl>
		);
	};

	renderFilterButton = (): React$Node => {
		const {openingFilterForm, usesFilter, value} = this.props;
		const {hasFilter} = this.state;
		const {FILLED_FILTER, FILTER} = ICON_NAMES;
		const {filterId} = value.source;
		const active = !!filterId || hasFilter;
		const iconName = active ? FILLED_FILTER : FILTER;
		const className = cn({
			[styles.filterButtonIconOpening]: openingFilterForm,
			[styles.filterButton]: true
		});

		if (usesFilter) {
			return (
				<div className={className} onClick={this.callFilterModal}>
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
					<T text="SourceFieldset::RemoveButton" />
				</button>
			);
		}
	};

	renderSavedFiltersButton = (): React$Node => {
		const {filterList, filtersListLoading, isPersonal, showSavedFilters, usesFilter} = this.props;

		if (!isPersonal && showSavedFilters && usesFilter && filterList && filterList.length > 0) {
			return (
				<FormField className={styles.savedFiltersButton} small>
					<SavedFilters
						filters={filterList}
						isPersonal={false}
						loading={filtersListLoading}
						onDelete={this.handleDeleteSavedFilters}
						onSelect={this.handleSelectFilters}
					/>
				</FormField>
			);
		}

		return null;
	};

	renderSourceRowNameCheckbox = () => {
		const {index, showSourceRowName, value} = this.props;
		const disabled = index !== 0;
		const checked = isDontUseParamsForDataSet(value);

		if (showSourceRowName) {
			return (
				<FormControl label={t('SourceFieldset::SourceRowNameCheckbox')}>
					<Checkbox
						checked={checked}
						className={styles.sourceRowName}
						disabled={disabled}
						onChange={this.handleSetSourceRowName}
						value={checked}
					/>
				</FormControl>);
		}

		return null;
	};

	renderSourceSelect = (): React$Node => {
		const {index} = this.props;
		const {error, showEditForm} = this.state;

		const component = showEditForm ? this.renderLabelEditingForm() : this.renderSourceTreeSelect();
		const paths = [
			getErrorPath(DIAGRAM_FIELDS.data, index, DIAGRAM_FIELDS.source),
			getErrorPath(DIAGRAM_FIELDS.data, index, DIAGRAM_FIELDS.sourceForCompute)
		];

		return (
			<FormField paths={paths} small>
				<div className={styles.combinedContainer}>
					{this.renderFilterButton()}
					{component}
				</div>
				{this.renderRemoveButton()}
				{this.renderComputeCheckbox()}
				{this.renderSourceRowNameCheckbox()}
				<FieldError text={error} />
			</FormField>
		);
	};

	renderSourceSelectIndicators = (props): React$Node => {
		const {isPersonal} = this.props;
		const {children, className, onClick} = props;
		const isChanged = this.isCurrentFilterChanged();

		const saveButton = isChanged && !isPersonal
			? (<IconButton icon={ICON_NAMES.SAVE} onClick={this.showSaveForm} tip={t('SourceFieldset::SaveButton')} />)
			: null;

		return (
			<div className={className} onClick={onClick}>
				<IconButton icon={ICON_NAMES.EDIT} onClick={this.showEditForm} />
				{saveButton}
				{children}
			</div>
		);
	};

	renderSourceSelectLabel = (props: ContainerProps): React$Node => {
		const {isPersonal, value} = this.props;
		const {className} = props;
		const label = value.source.value?.label ?? t('SourceFieldset::SourceSelectLabel');
		const isChanged = this.isCurrentFilterChanged();

		return (
			<div className={styles.sourceSelectLabel}>
				{isChanged && !isPersonal && <div className={styles.unsaveMarker}>*</div>}
				<div className={className} title={label}>{label}</div>
			</div>
		);
	};

	renderSourceTreeSelect = (): React$Node => {
		const {disabled, sources, value: {source}} = this.props;
		const {value: sourceValue} = source;
		const isChanged = this.isCurrentFilterChanged();
		const components = this.getSourceSelectComponents();

		return (
			<TreeSelect
				className={styles.sourceTreeSelect}
				components={components}
				disabled={disabled}
				isChanged={isChanged}
				onRemove={this.handleRemoveSource}
				onSelect={this.handleSelect}
				options={sources}
				ref={this.selectRef}
				removable={!disabled}
				value={sourceValue}
			/>
		);
	};

	render () {
		return (
			<div className={styles.container} ref={this.containerRef}>
				{this.renderSourceSelect()}
				{this.renderSavedFiltersButton()}
			</div>
		);
	}
}

export default withCommonDialog(SourceFieldset);
