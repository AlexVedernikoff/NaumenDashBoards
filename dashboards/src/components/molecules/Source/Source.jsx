// @flow
import cn from 'classnames';
import {CrossIcon, EditIcon} from 'icons/form';
import {ExtendButton, FieldError, IconButton, LegacyCheckbox as Checkbox, OutsideClickDetector} from 'components/atoms';
import {InputForm, SourceTree} from 'components/molecules';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import type {Source as SourceValue} from 'store/widgets/data/types';
import styles from './styles.less';

export class Source extends PureComponent<Props, State> {
	static defaultProps = {
		defaultValue: {
			label: 'Выберите значение',
			value: ''
		}
	};

	state = {
		showForm: false,
		showList: false
	};

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

	handleChangeLabel = (label: string) => {
		const {name, onChangeLabel, value} = this.props;
		onChangeLabel(name, {...value, label});
	};

	handleClickOutside = () => this.setState({showList: false});

	handleClickRemoveButton = () => {
		const {name, onRemove} = this.props;
		onRemove(name);
	};

	handleRemoveValue = () => {
		const {name, onSelect} = this.props;
		onSelect(name, null);
	};

	handleSelect = async (value: SourceValue) => {
		const {name, onSelect, onSelectCallback} = this.props;

		this.setState({showList: false});
		await onSelect(name, value);

		if (onSelectCallback && typeof onSelectCallback === 'function') {
			// $FlowFixMe
			setTimeout(() => onSelectCallback(name, value));
		}
	};

	handleShowList = () => this.setState({showList: !this.state.showList});

	hideForm = () => this.setState({showForm: false});

	showForm = () => this.setState({showForm: true});

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

	renderEditTitleForm = () => {
		const {value} = this.props;
		const {showForm} = this.state;

		if (showForm) {
			const label = value ? value.label : '';

			return (
				<InputForm
					onClose={this.hideForm}
					onSubmit={this.handleChangeLabel}
					value={label}
				/>
			);
		}
	};

	renderError = () => <FieldError text={this.props.error} />;

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

	renderIndicators = () => {
		const {value} = this.props;

		if (value) {
			return (
				<div className={styles.indicators}>
					<IconButton onClick={this.showForm}>
						<EditIcon />
					</IconButton>
					<IconButton onClick={this.handleRemoveValue}>
						<CrossIcon />
					</IconButton>
				</div>
			);
		}
	};

	renderInput = () => this.state.showForm ? this.renderEditTitleForm() : this.renderTreeSelect();

	renderLabel = () => {
		const {defaultValue, value} = this.props;
		const labelCN = cn({
			[styles.label]: true,
			[styles.defaultLabel]: !value
		});
		const label = value ? value.label : defaultValue.label;

		return <div className={labelCN} onClick={this.handleShowList}>{label}</div>;
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

	renderTree = () => {
		const {sources, value} = this.props;
		const {showList} = this.state;

		if (showList) {
			return <SourceTree className={styles.list} onSelect={this.handleSelect} sources={sources} value={value} />;
		}
	};

	renderTreeSelect = () => (
		<Fragment>
			<div className={styles.select} onClick={this.handleShowList}>
				{this.renderLabel()}
				{this.renderIndicators()}
				{this.renderRemoveButton()}
				{this.renderTree()}
			</div>
			{this.renderError()}
		</Fragment>
	);

	render () {
		return (
			<OutsideClickDetector onClickOutside={this.handleClickOutside}>
				<div className={styles.container}>
					{this.renderInput()}
					{this.renderComputeCheckbox()}
					{this.renderFilterButton()}
				</div>
			</OutsideClickDetector>
		);
	}
}

export default Source;
