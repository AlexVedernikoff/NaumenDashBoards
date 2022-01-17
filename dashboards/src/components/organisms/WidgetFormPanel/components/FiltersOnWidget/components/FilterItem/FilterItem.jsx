// @flow
import type {Attribute} from 'store/sources/attributes/types';
import FormField from 'WidgetFormPanel/components/FormField';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {InputRef} from 'components/types';
import LabelEditingForm from 'components/molecules/InputForm';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';
import t from 'localization';

export class FilterItem extends PureComponent<Props, State> {
	state = {
		isEditLabel: false
	};

	labelEditRef: InputRef = createRef();

	componentDidMount () {
		const {value: {dataSetIndex, label}} = this.props;

		if (dataSetIndex === null && label === '') {
			this.handleShowLabelEditor();
		}
	}

	fetchOptions = () => {
		const {dataSets, fetchAttributes, value} = this.props;
		const {dataSetIndex} = value;

		if (typeof dataSetIndex === 'number') {
			const selectedDataSet = dataSets[dataSetIndex];
			const {attributes = [], attributesLoading} = selectedDataSet;

			if (!attributesLoading && attributes.length === 0) {
				fetchAttributes(dataSetIndex);
			}
		}
	};

	handleChangeAttribute = ({value}) => {
		const {onChangeAttribute} = this.props;
		return onChangeAttribute([value]);
	};

	handleChangeDataSet = ({value}) => {
		const {onChangeDataSet} = this.props;
		const {dataSetIndex} = value;
		return onChangeDataSet(dataSetIndex);
	};

	handleChangeLabel = (value: string, callback?: Function) => {
		const {onChangeLabel} = this.props;

		onChangeLabel(value, () => {
			this.handleCloseLabelEditor();
			callback && callback();
		});
	};

	handleCloseLabelEditor = () => this.setState({isEditLabel: false});

	handleDeleteFilter = () => {
		const {onDelete} = this.props;
		return onDelete();
	};

	handleShowLabelEditor = () => this.setState({isEditLabel: true}, () => {
		const {current} = this.labelEditRef;
		return current && current.focus();
	});

	renderAttributeSelector = (): React$Node => {
		const {dataSets, idx, value} = this.props;

		if (value) {
			const {dataSetIndex} = value;

			if (typeof dataSetIndex === 'number') {
				const selectedDataSet = dataSets[dataSetIndex];
				const {attributes = [], attributesLoading} = selectedDataSet;
				const attribute = value.attributes && value.attributes.length > 0 ? value.attributes[0] : null;
				const filterAttributes = attributes.filter(({code, metaClassFqn}) =>
					code !== 'UUID'
					&& !(metaClassFqn === 'employee' && code === 'password')
					&& !(metaClassFqn === 'employee' && code === 'immediateSupervisor')
				);

				return (
					<FormField
						className={styles.attributeFormField}
						label={t('FiltersOnWidget::FilterItem::Attribute')}
						path={`filtersOnWidget[${idx}].attributes`}
						small
					>
						<Select
							fetchOptions={this.fetchOptions}
							getOptionLabel={(attribute: Attribute) => attribute.title}
							getOptionValue={(attribute: Attribute) => attribute}
							isSearching={true}
							loading={attributesLoading}
							onSelect={this.handleChangeAttribute}
							options={filterAttributes}
							placeholder={t('FiltersOnWidget::FilterItem::AttributePlaceholder')}
							value={attribute}
						/>
					</FormField>
				);
			}
		}

		return null;
	};

	renderDataSetSelector = (): React$Node => {
		const {dataSets, idx, value} = this.props;
		const {dataSetIndex} = value;
		const selected = dataSetIndex !== undefined && dataSetIndex !== null ? dataSets[dataSetIndex] : null;

		return (
			<FormField
				label={t('FiltersOnWidget::FilterItem::Source')}
				path={`filtersOnWidget[${idx}].dataSetIndex`}
				small
			>
				<Select
					editable={false}
					getOptionLabel={dataSet => dataSet.source.value?.label}
					getOptionValue={dataSet => dataSet.dataSetIndex}
					onSelect={this.handleChangeDataSet}
					options={dataSets}
					placeholder={t('FiltersOnWidget::FilterItem::SourcePlaceholder')}
					value={selected}
				/>
			</FormField>
		);
	};

	renderLabel = (): React$Node => {
		const {isEditLabel} = this.state;
		return isEditLabel ? this.renderLabelEditor() : this.renderLabelView();
	};

	renderLabelEditor = (): React$Node => {
		const {idx, value: {label}} = this.props;
		return (
			<FormField className={styles.labelEditorForm} path={`filtersOnWidget[${idx}].label`}>
				<LabelEditingForm
					className={styles.form}
					forwardedRef={this.labelEditRef}
					onClose={this.handleCloseLabelEditor}
					onSubmit={this.handleChangeLabel}
					value={label}
				/>
			</FormField>
		);
	};

	renderLabelView = (): React$Node => {
		const {idx, value: {label}} = this.props;
		return (
			<FormField path={`filtersOnWidget[${idx}].label`}>
				<div className={styles.labelView} >
					<div className={styles.labelViewLabel} onDoubleClick={this.handleShowLabelEditor}>{label}</div>
					<div className={styles.labelViewButtons}>
						<IconButton height={13} icon={ICON_NAMES.EDIT} onClick={this.handleShowLabelEditor} />
						<IconButton icon={ICON_NAMES.BASKET} onClick={this.handleDeleteFilter} />
					</div>
				</div>
			</FormField>
		);
	};

	render () {
		return (
			<div className={styles.filterItem}>
				{this.renderLabel()}
				{this.renderDataSetSelector()}
				{this.renderAttributeSelector()}
			</div>
		);
	}
}

export default FilterItem;
