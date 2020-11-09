// @flow
import {ExtendButton, LegacyCheckbox as Checkbox} from 'components/atoms';
import {FIELDS} from 'DiagramWidgetEditForm';
import {FormField} from 'DiagramWidgetEditForm/components';
import {getDescriptorCases} from 'src/helpers';
import {ICON_NAMES} from 'components/atoms/Icon';
import {isSourceType} from 'store/sources/data/helpers';
import type {OnChangeLabelEvent, OnRemoveEvent} from 'components/molecules/TreeSelect/types';
import type {OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';
import {TreeSelect} from 'components/molecules';

export class SourceFieldset extends Component<Props> {
	static defaultProps = {
		removable: true,
		usesFilter: true
	};

	callFilterModal = async () => {
		const {index, onChangeDescriptor, set} = this.props;
		const {descriptor, source} = set;

		if (source) {
			const {value: classFqn} = source;
			const context = descriptor ? this.getFilterContext(descriptor, classFqn) : this.createFilterContext(source.value);

			try {
				const {serializedContext} = await window.jsApi.commands.filterForm(context);
				onChangeDescriptor(index, serializedContext);
			} catch (e) {
				console.error('Ошибка окна фильтрации: ', e);
			}
		}
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

	handleChangeCompute = (name: string, value: boolean) => {
		const {index, onChangeCompute} = this.props;
		onChangeCompute(index, {name, value});
	};

	handleChangeSourceLabel = (event: OnChangeLabelEvent) => {
		const {index, onChange, set} = this.props;
		let {source} = set;

		if (source) {
			const {label, name} = event;
			source = {...source, label};

			onChange(index, name, source);
		}
	};

	handleClickRemoveButton = () => {
		const {index, onRemove} = this.props;
		onRemove(index);
	};

	handleRemoveSource = (event: OnRemoveEvent) => {
		const {index, onChange} = this.props;
		const {name} = event;

		onChange(index, name, null);
	};

	handleSelect = (event: OnSelectEvent) => {
		const {index, onSelectSource, sourceRefFields} = this.props;
		const {name, value: source} = event;
		let value = null;

		if (source) {
			value = {
				label: source.label,
				value: source.value
			};
		}

		onSelectSource(index, {name, value}, sourceRefFields);
	};

	renderComputeCheckbox = () => {
		const {set} = this.props;
		const {sourceForCompute} = set;

		return (
			<Checkbox
				label="Только для вычислений"
				name={FIELDS.sourceForCompute}
				onClick={this.handleChangeCompute}
				value={sourceForCompute}
			/>
		);
	};

	renderFilterButton = () => {
		const {set, usesFilter} = this.props;
		const {FILLED_FILTER, FILTER} = ICON_NAMES;
		const {descriptor} = set;
		const active = descriptor && !!JSON.parse(descriptor).filters;
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
		const {error, set, sources} = this.props;
		const {source} = set;
		let initialSelected;

		if (source) {
			initialSelected = [source.value];
		}

		return (
			<FormField error={error} small>
				<TreeSelect
					initialSelected={initialSelected}
					name={FIELDS.source}
					onChangeLabel={this.handleChangeSourceLabel}
					onRemove={this.handleRemoveSource}
					onSelect={this.handleSelect}
					options={sources}
					removable={true}
					value={source}
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
