// @flow
import Checkbox from 'components/atoms/LegacyCheckbox';
import type {Components as TreeSelectComponents, TreeSelectLabelContainerProps} from 'components/molecules/TreeSelect/types';
import {FOOTER_POSITIONS, SIZES} from 'components/molecules/Modal/constants';
import FormField from 'DiagramWidgetEditForm/components/FormField';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import IconButton from 'components/atoms/IconButton';
import LabelEditingForm from 'components/molecules/InputForm';
import Modal from 'components/molecules/Modal';
import {MODE} from './constraints';
import type {OnSelectEvent} from 'components/types';
import type {Props, State} from './types';
import React, {Component} from 'react';
import SavedFilters from 'DiagramWidgetEditForm/components/SavedFilters';
import type {SourceData} from 'containers/DiagramWidgetEditForm/types';
import type {SourceFiltersItem} from 'store/sources/sourcesFilters/types';
import styles from './styles.less';
import TreeSelect from 'components/molecules/TreeSelect';

export class SourceFieldset extends Component<Props, State> {
	static defaultProps = {
		removable: true,
		usesFilter: true
	};

	state = {
		confirmOption: null,
		errorMessage: null,
		mode: null,
		showEditForm: false
	};

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
		// $FlowFixMe
		const {dataSet: {source}, updateSourcesFilter} = this.props;
		const {mode} = this.state;

		if (source.value) {
			const {descriptor, filterId, value} = source;

			if (descriptor) {
				const {message = '', payload, result} = await updateSourcesFilter(
					value.value,
					{
						descriptor,
						id: mode === MODE.SAVE ? null : filterId,
						label
					}
				);

				if (result) {
					this.changeDataSet({
						...source,
						filterId: payload,
						value: {
							...value,
							label
						}
					});
				} else {
					this.showErrorForm(message);
				}
			} else {
				this.changeDataSet({
					...source,
					value: {
						...value,
						label
					}
				});
			}
		}

		this.hideEditForm();
	};

	handleClickRemoveButton = () => {
		const {dataSetIndex, onRemove} = this.props;

		onRemove(dataSetIndex);
	};

	handleCloseConfirmDialog = (isSuccess: boolean) => () => {
		const {confirmOption} = this.state;

		if (confirmOption) {
			const {resolve} = confirmOption;

			resolve(isSuccess);
		}

		this.setState({confirmOption: null});
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
		const {checkApplyFilter, dataSet} = this.props;
		const {id, label} = sourceFilter;
		const {value} = dataSet.source;

		if (value) {
			const approvalToApply = await checkApplyFilter(value.value, sourceFilter);

			if (
				approvalToApply.result
				|| await this.showConfirm(
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

	hideEditForm = () =>
		this.setState({mode: null, showEditForm: false});

	hideErrorForm = () =>
		this.setState({errorMessage: null});

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

	showConfirm = (title: string, text: string, notice: boolean = true): Promise<boolean> => {
		return new Promise<boolean>((resolve) => {
			this.setState({confirmOption: {notice, resolve, text, title}});
		});
	};

	showEditForm = () => this.setState({mode: MODE.EDIT, showEditForm: true});

	showErrorForm = (errorMessage: string) => this.setState({errorMessage});

	showSaveForm = () => this.setState({mode: MODE.SAVE, showEditForm: true});

	renderAlerts = (): React$Node => {
		const {errorMessage} = this.state;

		if (errorMessage) {
			return (
				<Modal
					footerPosition={FOOTER_POSITIONS.RIGHT}
					header="Ошибка"
					notice={true}
					onSubmit={this.hideErrorForm}
					showCancelButton={false}
					size={SIZES.SMALL}
					submitText="Ok"
				>
					{errorMessage}
				</Modal>
			);
		}

		return null;
	};

	renderComputeCheckbox = (): React$Node => {
		const {computable, dataSet} = this.props;
		const {sourceForCompute} = dataSet;

		if (computable) {
			return <Checkbox label="Только для вычислений" onClick={this.handleChangeCompute} value={sourceForCompute} />;
		}

		return null;
	};

	renderConfirm = (): React$Node => {
		const {confirmOption} = this.state;

		if (confirmOption) {
			const {notice = true, text, title} = confirmOption;
			return (
				<Modal
					footerPosition={FOOTER_POSITIONS.RIGHT}
					header={title}
					notice={notice}
					onClose={this.handleCloseConfirmDialog(false)}
					onSubmit={this.handleCloseConfirmDialog(true)}
					submitText="Ok"
				>
					{text}
				</Modal>
			);
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
		const {error} = this.props;
		const {showEditForm} = this.state;

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
		const {dataSet: {source}, sources} = this.props;
		const {value: sourceValue} = source;

		let initialSelected;

		if (sourceValue) {
			initialSelected = [sourceValue.value];
		}

		const components = this.getSourceSelectComponents();

		return (
			<TreeSelect
				className={styles.sourceTreeSelect}
				components={components}
				initialSelected={initialSelected}
				onSelect={this.handleSelect}
				options={sources}
				removable={true}
				value={sourceValue}
			/>
		);
	};

	render (): React$Node {
		return (
			<div className={styles.container}>
				{this.renderAlerts()}
				{this.renderConfirm()}
				{this.renderSourceSelect()}
				{this.renderRemoveButton()}
				{this.renderComputeCheckbox()}
				{this.renderSavedFiltersButton()}
			</div>
		);
	}
}

export default SourceFieldset;
