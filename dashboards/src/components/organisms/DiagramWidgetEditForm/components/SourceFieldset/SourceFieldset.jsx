// @flow
import {ExtendButton, LegacyCheckbox as Checkbox} from 'components/atoms';
import {FormField} from 'DiagramWidgetEditForm/components';
import {getDescriptorCases} from 'helpers';
import {ICON_NAMES} from 'components/atoms/Icon';
import {isSourceType} from 'store/sources/data/helpers';
import type {OnChangeLabelEvent} from 'components/molecules/TreeSelect/types';
import type {OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {Component} from 'react';
import type {SourceData} from 'containers/DiagramWidgetEditForm/types';
import styles from './styles.less';
import {TreeSelect} from 'components/molecules';

export class SourceFieldset extends Component<Props> {
	static defaultProps = {
		removable: true,
		usesFilter: true
	};

	callFilterModal = async () => {
		const {dataSetIndex, onFetchDynamicAttributes, value} = this.props;
		const {descriptor, value: sourceValue} = value;

		if (sourceValue) {
			const {value: classFqn} = sourceValue;
			const context = descriptor ? this.getFilterContext(descriptor, classFqn) : this.createFilterContext(classFqn);

			try {
				const {serializedContext: newDescriptor} = await window.jsApi.commands.filterForm(context);

				onFetchDynamicAttributes(dataSetIndex, newDescriptor);
				this.change({
					...value,
					descriptor: newDescriptor
				});
			} catch (e) {
				console.error('Ошибка окна фильтрации: ', e);
			}
		}
	};

	change = (source: SourceData) => {
		const {dataSetIndex, onChange} = this.props;
		onChange(dataSetIndex, source);
	};

	createFilterContext = (classFqn: string) => {
		const context: Object = {};

		if (isSourceType(classFqn)) {
			context.cases = getDescriptorCases(classFqn);
		} else {
			context.clazz = classFqn;
		}

		return context;
	};

	getFilterContext = (descriptor: string, classFqn: string) => {
		let context = JSON.parse(descriptor);

		if (!context.clazz) {
			context = {
				...context,
				cases: getDescriptorCases(classFqn)
			};
		}

		return context;
	};

	handleChangeCompute = (name: string, value: boolean) => this.change({
		...this.props.value,
		forCompute: value
	});

	handleChangeSourceLabel = ({label}: OnChangeLabelEvent) => {
		const {value: source} = this.props;

		this.change({
			...source,
			value: {
				...source.value,
				label
			}
		});
	};

	handleClickRemoveButton = () => {
		const {dataSetIndex, onRemove} = this.props;
		onRemove(dataSetIndex);
	};

	handleRemoveSource = () => this.change({
		...this.props.value,
		value: null
	});

	handleSelect = ({value: newSourceValue}: OnSelectEvent) => {
		const {dataSetIndex, onFetchAttributes, value: source} = this.props;
		const {value: sourceValue} = source;
		const {label, value} = newSourceValue;
		let newSource = source;

		if ((sourceValue && !newSourceValue) || (newSourceValue && sourceValue && newSourceValue.value !== sourceValue.value)) {
			newSource = {
				...newSource,
				descriptor: ''
			};
		}

		onFetchAttributes(dataSetIndex, value);
		this.change({
			...newSource,
			value: {
				label,
				value
			}
		});
	};

	renderComputeCheckbox = () => {
		const {computable, dataSet} = this.props;
		const {forCompute} = dataSet.source;

		if (computable) {
			return <Checkbox label="Только для вычислений" onClick={this.handleChangeCompute} value={forCompute} />;
		}
	};

	renderFilterButton = () => {
		const {dataSet, usesFilter} = this.props;
		const {FILLED_FILTER, FILTER} = ICON_NAMES;
		const {descriptor} = dataSet;
		const active = !!descriptor && !!JSON.parse(descriptor).filters;
		const iconName = active ? FILLED_FILTER : FILTER;

		if (usesFilter) {
			return (
				<ExtendButton
					active={active}
					iconName={iconName}
					onClick={this.callFilterModal}
					text="Фильтрация"
				/>
			);
		}
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

	renderSourceSelect = () => {
		const {error, sources, value} = this.props;
		const {value: sourceValue} = value;
		let initialSelected;

		if (sourceValue) {
			initialSelected = [sourceValue.value];
		}

		return (
			<FormField error={error} small>
				<TreeSelect
					initialSelected={initialSelected}
					onChangeLabel={this.handleChangeSourceLabel}
					onRemove={this.handleRemoveSource}
					onSelect={this.handleSelect}
					options={sources}
					removable={true}
					value={sourceValue}
				/>
			</FormField>
		);
	};

	render () {
		return (
			<div className={styles.container}>
				{this.renderSourceSelect()}
				{this.renderRemoveButton()}
				{this.renderComputeCheckbox()}
				{this.renderFilterButton()}
			</div>
		);
	}
}

export default SourceFieldset;
