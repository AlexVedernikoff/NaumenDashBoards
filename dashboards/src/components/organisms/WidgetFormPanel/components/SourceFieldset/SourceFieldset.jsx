// @flow
import {ExtendButton, LegacyCheckbox as Checkbox} from 'components/atoms';
import {FIELDS} from 'WidgetFormPanel/constants';
import {FormField} from 'WidgetFormPanel/components';
import type {OnChangeLabelEvent, OnRemoveEvent} from 'components/molecules/TreeSelect/types';
import type {OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';
import {TreeSelect} from 'components/molecules';

export class SourceFieldset extends Component<Props> {
	static defaultProps = {
		removable: true,
		useFilter: true
	};

	callFilterModal = async () => {
		const {index, onChangeDescriptor, set} = this.props;
		const {descriptor, source} = set;

		if (source) {
			let context = descriptor ? JSON.parse(descriptor) : this.createFilterContext(source.value);

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

		if (classFqn.includes('$')) {
			context.cases = [classFqn];
		} else {
			context.clazz = classFqn;
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
		const {set, useFilter} = this.props;
		const active = !!set.descriptor;

		return useFilter && <ExtendButton active={active} onClick={this.callFilterModal} text="Фильтр" />;
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
