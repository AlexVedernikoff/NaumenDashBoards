// @flow
import Checkbox from 'components/atoms/LegacyCheckbox';
import type {Components as TreeSelectComponents, TreeSelectLabelContainerProps} from 'components/molecules/TreeSelect/types';
import type {DivRef, OnSelectEvent} from 'components/types';
import FormField from 'DiagramWidgetEditForm/components/FormField';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import IconButton from 'components/atoms/IconButton';
import LabelEditingForm from 'components/molecules/InputForm';
import {MODE} from './constraints';
import type {Props, State} from './types';
import React, {Component, createRef} from 'react';
import SavedFilters from 'DiagramWidgetEditForm/components/SavedFilters';
import type {SourceData} from 'containers/DiagramWidgetEditForm/types';
import type {SourceFiltersItem} from 'store/sources/sourcesFilters/types';
import styles from './styles.less';
import TreeSelect from 'components/molecules/TreeSelect';
import {withCommonDialog} from 'containers/CommonDialogs/withCommonDialog';

export class SourceFieldset extends Component<Props, State> {
	static defaultProps = {
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

	callFilterModal = async (): Promise<void> => {
		const {dataSet, openFilterForm} = this.props;
		const context = await openFilterForm();

		if (context) {
			this.changeDataSet({
				...dataSet.source,
				descriptor: context,
				filterId: null
			});
		}
	};

	changeDataSet = (source: SourceData) => {
		const {dataSetIndex, onChangeDataSet} = this.props;

		onChangeDataSet(dataSetIndex, source);
	};

	componentDidMount = () => {
		const {dataSetIndex} = this.props;

		if (dataSetIndex > 0) {
			this.sourceSelectRef.current && this.sourceSelectRef.current.scrollIntoView({behavior: 'smooth'});
		}
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

	handleChangeCompute = (name: string, value: boolean) => {
		const {dataSetIndex, onChangeForCompute} = this.props;

		onChangeForCompute(dataSetIndex, value);
	};

	handleChangeFilterLabel = async (label: string): Promise<void> => {
		const {dataSet: {source}, filterList, updateSourcesFilter} = this.props;
		const {mode} = this.state;
		let error = null;

		if (!filterList.find(filter => filter.label === label)) {
			if (source.value) {
				const {descriptor, filterId, value} = source;

				if (descriptor) {
					const id = mode === MODE.SAVE ? null : filterId;
					const data = await updateSourcesFilter(value.value, {descriptor, id, label});

					if (data.result) {
						const {filterId} = data;

						this.changeDataSet({...source, filterId, value: {...value, label}});
						this.hideEditForm();
					} else {
						error = data.message;
					}
				} else {
					this.changeDataSet({...source, value: { ...value, label }});
					this.hideEditForm();
				}
			}
		} else {
			error = 'Название фильтра должно быть уникально';
		}

		this.setInnerError(error);
	};

	handleClickRemoveButton = () => {
		const {dataSetIndex, onRemove} = this.props;

		onRemove(dataSetIndex);
	};

	handleDeleteSavedFilters = (id: string) => {
		const {dataSet: {source}, deleteSourcesFilter} = this.props;

		if (source.value) {
			deleteSourcesFilter(source.value.value, id);
		}
	};

	handleRemoveSource = () => this.changeDataSet({
		descriptor: '',
		filterId: null,
		value: null
	});

	handleSelect = ({value: newRawSourceValue}: OnSelectEvent) => {
		const {dataSet: {source}} = this.props;
		const {value: sourceValue} = source;
		let newSource = source;

		const newSourceValue = newRawSourceValue
			? { label: newRawSourceValue.label, value: newRawSourceValue.value }
			: newRawSourceValue;

		if ((sourceValue && !newSourceValue) || (newSourceValue && sourceValue && newSourceValue.value !== sourceValue.value)) {
			newSource = {
				...newSource,
				descriptor: ''
			};
		}

		this.changeDataSet({
			...newSource,
			filterId: null,
			value: newSourceValue
		});
	};

	handleSelectFilters = async (sourceFilter: SourceFiltersItem) => {
		const {checkApplyFilter, confirm, dataSet} = this.props;
		const {id, label} = sourceFilter;
		const {value} = dataSet.source;

		if (value) {
			const approvalToApply = await checkApplyFilter(value.value, sourceFilter);

			if (
				approvalToApply.result
				|| await confirm(
						'Ошибка применения фильтра',
						'Выбранный фильтр не может быть применен полностью, т.к. содержит условия, связанные с текущим объектом. Применить частично?'
					)
			) {
				this.changeDataSet({
					...dataSet.source,
					filterId: id,
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
		const {dataSet: {source}, filterList = []} = this.props;

		if (source !== null) {
			const {descriptor} = source;

			if (source.filterId) {
				const usedFilter = filterList.find(filter => filter.id === source.filterId);

				return descriptor === usedFilter?.value;
			} else if (descriptor) {
				return !!JSON.parse(descriptor).filters;
			}
		}

		return false;
	};

	setInnerError = (error: ?string) => this.setState({error});

	showEditForm = () => this.setState({mode: MODE.EDIT, showEditForm: true});

	showSaveForm = () => this.setState({mode: MODE.SAVE, showEditForm: true});

	renderComputeCheckbox = (): React$Node => {
		const {computable, dataSet} = this.props;
		const {sourceForCompute} = dataSet;

		if (computable) {
			return <Checkbox label="Только для вычислений" onClick={this.handleChangeCompute} value={sourceForCompute} />;
		}

		return null;
	};

	renderFilterButton = (): React$Node => {
		const {dataSet, usesFilter} = this.props;
		const {FILLED_FILTER, FILTER} = ICON_NAMES;
		const {descriptor, filterId} = dataSet.source;
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
		const {dataSet: {source: {value}}} = this.props;
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

	renderRemoveButton = (): React$Node => {
		const {removable} = this.props;

		if (removable) {
			return (
				<button className={styles.removeButton} onClick={this.handleClickRemoveButton} type="button">
					удалить
				</button>
			);
		}

		return null;
	};

	renderSavedFiltersButton = (): React$Node => {
		const {filterList, filtersListLoading, usesFilter} = this.props;

		if (usesFilter && filterList && filterList.length > 0) {
			return (
				<SavedFilters
					filters={filterList}
					loading={filtersListLoading}
					onDelete={this.handleDeleteSavedFilters}
					onSelect={this.handleSelectFilters}
				/>
			);
		}

		return null;
	};

	renderSourceSelect = (): React$Node => {
		const {error: outerError} = this.props;
		const {error: innerError, showEditForm} = this.state;
		const error = outerError || innerError;

		const component = showEditForm ? this.renderLabelEditingForm() : this.renderSourceTreeSelect();

		return (
			<FormField error={error} small>
				<div className={styles.combinedContainer}>
					{this.renderFilterButton()}
					{component}
				</div>
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
		const {dataSet: {source}, dataSetIndex, sources} = this.props;
		const {value: sourceValue} = source;

		let initialSelected;

		if (sourceValue) {
			initialSelected = [sourceValue.value];
		}

		const components = this.getSourceSelectComponents();
		const isActive = dataSetIndex > 0;

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

	render (): React$Node {
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
