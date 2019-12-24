// @flow
import {Checkbox, ExtendButton, FieldError} from 'components/atoms';
import type {Props, SourceValue} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import {TreeSelectInput} from 'components/molecules';

export class Source extends PureComponent<Props> {
	callFilterModal = async () => {
		const {descriptor, value: source} = this.props;
		const {name, onChange, value} = descriptor;

		if (source) {
			let context = value ? JSON.parse(value) : this.createFilterContext(source.value);

			try {
				const {serializedContext} = await window.jsApi.commands.filterForm(context);
				onChange(name, serializedContext);
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

	handleChangeLabel = (name: string, label: string) => {
		const {onChangeLabel, value} = this.props;

		if (value) {
			value.label = label;
			onChangeLabel(name, value);
		}
	};

	handleClickRemoveButton = () => {
		const {name, onRemove} = this.props;
		onRemove(name);
	};

	handleSelectSource = async (name: string, value: SourceValue | null) => {
		const {onSelect, onSelectCallback} = this.props;

		await onSelect(name, value);

		if (onSelectCallback && typeof onSelectCallback === 'function') {
			// $FlowFixMe
			setTimeout(() => onSelectCallback(name, value));
		}
	};

	renderComputeCheckbox = () => {
		const {compute} = this.props;
		const {name, onChange, value} = compute;

		return (
			<div className={styles.checkboxContainer}>
				<Checkbox
					label="Только для вычислений"
					name={name}
					onClick={onChange}
					value={value}
				/>
			</div>
		);
	};

	renderInput = () => {
		const {error, name, sources, value} = this.props;

		return (
			<Fragment>
				<TreeSelectInput
					name={name}
					onChange={this.handleSelectSource}
					onChangeLabel={this.handleChangeLabel}
					placeholder="Выберите значение"
					tree={sources}
					value={value}
				/>
				<FieldError text={error} />
			</Fragment>
		);
	};

	renderFilterButton = () => {
		const {value} = this.props.descriptor;

		return (
			<div className={styles.filterContainer}>
				<ExtendButton
					active={!!value}
					onClick={this.callFilterModal}
					text="Фильтр"
				/>
			</div>
		);
	};

	renderRemoveButton = () => {
		const {isRemovable} = this.props;

		if (isRemovable) {
			return (
				<button className={styles.removeButton} onClick={this.handleClickRemoveButton} type="button">
					удалить
				</button>
			);
		}
	};

	render () {
		return (
			<div className={styles.container}>
				{this.renderInput()}
				{this.renderRemoveButton()}
				{this.renderComputeCheckbox()}
				{this.renderFilterButton()}
			</div>
		);
	}
}

export default Source;
