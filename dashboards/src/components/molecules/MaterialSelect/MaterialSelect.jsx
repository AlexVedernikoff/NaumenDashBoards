// @flow
import {ChevronDownIcon} from 'icons/form';
import cn from 'classnames';
import type {Option, Props, State} from './types';
import {OutsideClickDetector} from 'components/atoms';
import React, {PureComponent} from 'react';
import {SimpleSelectMenu} from 'components/molecules';
import styles from './styles.less';

export class MaterialSelect extends PureComponent<Props, State> {
	static defaultProps = {
		isEditingLabel: false,
		isSearching: false,
		name: '',
		placeholder: 'Выберите значение',
		showCreationButton: false,
		showMore: false,
		textCreationButton: 'Создать'
	};

	state = {
		showMenu: false
	};

	getOptionLabel = (option: Object) => {
		const {getOptionLabel} = this.props;
		return getOptionLabel ? getOptionLabel(option) : option.label;
	};

	getOptionValue = (option: Object) => {
		const {getOptionValue} = this.props;
		return getOptionValue ? getOptionValue(option) : option.value;
	};

	handleChangeLabel = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {onChangeLabel, value: currentValue} = this.props;
		const {value} = e.currentTarget;

		if (currentValue && onChangeLabel) {
			onChangeLabel(this.getOptionValue(currentValue), value);
		}
	};

	handleClickCreationButton = () => {
		const {onClickCreationButton} = this.props;

		this.setState({showMenu: false});
		onClickCreationButton && onClickCreationButton();
	};

	handleClickValue = () => this.setState({showMenu: !this.state.showMenu});

	handleSelect = (value: Option) => {
		const {name, onSelect} = this.props;

		this.setState({showMenu: false});
		onSelect(name, value);
	};

	hideMenu = () => this.setState({showMenu: false});

	renderCaret = () => <ChevronDownIcon className={styles.caret} />;

	renderMenu = () => {
		const {
			getOptionLabel,
			getOptionValue,
			isSearching,
			onClickShowMore,
			options,
			showCreationButton,
			showMore,
			textCreationButton,
			value
		} = this.props;
		const {showMenu} = this.state;
		let creationButton;

		if (showCreationButton) {
			creationButton = {
				onClick: this.handleClickCreationButton,
				text: textCreationButton
			};
		}

		if (showMenu) {
			return (
				<SimpleSelectMenu
					creationButton={creationButton}
					getOptionLabel={getOptionLabel}
					getOptionValue={getOptionValue}
					isSearching={isSearching}
					onClickShowMore={onClickShowMore}
					onClose={this.hideMenu}
					onSelect={this.handleSelect}
					options={options}
					showMore={showMore}
					value={value}
				/>
			);
		}
	};

	renderPlaceholder = () => {
		const {placeholder, value} = this.props;

		if (value && this.getOptionLabel(value)) {
			return <div className={styles.placeholder}>{placeholder}</div>;
		}
	};

	renderValue = () => {
		const {isEditingLabel, placeholder, value} = this.props;
		const label = value ? this.getOptionLabel(value) : '';
		const inputCN = cn({
			[styles.input]: true,
			[styles.editableInput]: isEditingLabel
		});

		return (
			<input
				className={inputCN}
				onChange={this.handleChangeLabel}
				placeholder={placeholder}
				readOnly={!isEditingLabel}
				value={label}
			/>
		);
	};

	renderValueContainer = () => {
		const {isEditingLabel} = this.props;
		const containerCN = cn({
			[styles.valueContainer]: true,
			[styles.editableValueContainer]: isEditingLabel
		});

		return (
			<div className={containerCN} onClick={this.handleClickValue}>
				{this.renderPlaceholder()}
				{this.renderValue()}
				{this.renderCaret()}
			</div>
		);
	};

	render () {
		return (
			<OutsideClickDetector onClickOutside={this.hideMenu}>
				<div className={styles.container}>
					{this.renderValueContainer()}
					{this.renderMenu()}
				</div>
			</OutsideClickDetector>
		);
	}
}

export default MaterialSelect;
