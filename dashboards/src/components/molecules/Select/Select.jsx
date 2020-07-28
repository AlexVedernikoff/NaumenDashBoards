// @flow
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import {List, Menu} from './components';
import type {Option, Props, State} from './types';
import {OutsideClickDetector} from 'components/atoms';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Select extends PureComponent<Props, State> {
	static defaultProps = {
		className: '',
		disabled: false,
		editable: false,
		name: '',
		showCreationButton: false,
		textCreationButton: 'Создать',
		value: null
	};

	state = {
		showMenu: false
	};

	getOptionLabel = (option: Object) => {
		const {getOptionLabel} = this.props;
		let label = option;

		if (option && typeof option === 'object') {
			label = getOptionLabel ? getOptionLabel(option) : option.label;
		}

		return label;
	};

	getOptionValue = (option: Object) => {
		const {getOptionValue} = this.props;
		let value = option;

		if (option && typeof option === 'object') {
			value = getOptionValue ? getOptionValue(option) : option.value;
		}

		return value;
	};

	handleChangeLabel = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {name, onChangeLabel} = this.props;
		const {value} = e.currentTarget;

		onChangeLabel && onChangeLabel({name, value});
	};

	handleClick = () => this.setState({showMenu: !this.state.showMenu});

	handleClickClearLabelIcon = () => {
		const {name, onChangeLabel} = this.props;
		onChangeLabel && onChangeLabel({name, value: ''});
	};

	handleClickCreationButton = () => {
		const {onClickCreationButton} = this.props;

		this.setState({showMenu: false});
		onClickCreationButton && onClickCreationButton();
	};

	handleSelect = (value: Option) => {
		const {name, onSelect} = this.props;

		this.setState({showMenu: false});
		onSelect({name, value});
	};

	hideMenu = () => this.setState({showMenu: false});

	renderCaretIcon = () => <Icon name={ICON_NAMES.CARET} />;

	renderClearIcon = () => {
		const {editable} = this.props;

		if (editable) {
			return (
				<Icon
					className={styles.clearLabelIcon}
					name={ICON_NAMES.REMOVE}
					onClick={this.handleClickClearLabelIcon}
				/>
			);
		}
	};

	renderIndicators = () => (
		<div className={styles.indicatorsContainer}>
			{this.renderClearIcon()}
			{this.renderCaretIcon()}
		</div>
	);

	renderLabel = () => {
		const {editable, value} = this.props;
		const label = this.getOptionLabel(value);

		if (editable) {
			return (
				<input className={styles.input} onChange={this.handleChangeLabel} value={label} />
			);
		}

		return label;
	};

	renderList = (searchValue: string) => {
		const {options, value} = this.props;

		return (
			<List
				getOptionLabel={this.getOptionLabel}
				getOptionValue={this.getOptionValue}
				onSelect={this.handleSelect}
				options={options}
				searchValue={searchValue}
				value={value}
			/>
		);
	};

	renderMenu = () => {
		const {showCreationButton, textCreationButton} = this.props;
		const {showMenu} = this.state;
		let creationButton;

		if (showCreationButton) {
			creationButton = {
				onClick: this.handleClickCreationButton,
				text: textCreationButton
			};
		}

		return showMenu && <Menu className={styles.menu} creationButton={creationButton} isSearching={false} renderList={this.renderList} />;
	};

	renderValueContainer = () => (
		<div className={styles.valueContainer} onClick={this.handleClick} tabIndex={1}>
			{this.renderLabel()}
			{this.renderIndicators()}
		</div>
	);

	render () {
		const {className, disabled} = this.props;
		const selectCN = cn({
			[styles.container]: true,
			[styles.disabledContainer]: disabled,
			[className]: true
		});

		return (
			<OutsideClickDetector onClickOutside={this.hideMenu}>
				<div className={selectCN}>
					{this.renderValueContainer()}
					{this.renderMenu()}
				</div>
			</OutsideClickDetector>
		);
	}
}

export default Select;
