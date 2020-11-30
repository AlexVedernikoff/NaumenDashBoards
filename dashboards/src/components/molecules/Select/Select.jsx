// @flow
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import {List, Menu} from './components';
import {Loader, OutsideClickDetector} from 'components/atoms';
import type {MenuProps, Option, Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Select extends PureComponent<Props, State> {
	static defaultProps = {
		async: false,
		className: '',
		components: {},
		disabled: false,
		editable: false,
		error: false,
		isSearching: false,
		loading: false,
		name: '',
		placeholder: '',
		showCreationButton: false,
		textCreationButton: 'Создать',
		uploaded: false,
		value: null
	};

	state = {
		showMenu: false
	};

	fetchOptions = () => {
		const {async, error, fetchOptions, loading, uploaded} = this.props;

		if (async && typeof fetchOptions === 'function' && (error || loading || uploaded) === false) {
			fetchOptions();
		}
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

	handleClick = () => {
		this.setState({showMenu: !this.state.showMenu});
		this.fetchOptions();
	};

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

	renderCaretIcon = () => <Icon className={styles.caret} name={ICON_NAMES.CHEVRON} />;

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

	renderDefaultMenu = (props: MenuProps) => {
		const {showCreationButton, textCreationButton} = this.props;
		const {showMenu} = this.state;
		let creationButton;

		if (showCreationButton) {
			creationButton = {
				onClick: this.handleClickCreationButton,
				text: textCreationButton
			};
		}

		return showMenu ? <Menu{...props} creationButton={creationButton} renderList={this.renderList} /> : null;
	};

	renderIndicators = () => (
		<div className={styles.indicatorsContainer}>
			{this.renderClearIcon()}
			{this.renderCaretIcon()}
		</div>
	);

	renderLabel = () => {
		const {editable, placeholder, value} = this.props;
		const label = this.getOptionLabel(value) || placeholder;

		if (editable) {
			return (
				<input className={styles.input} onChange={this.handleChangeLabel} value={label} />
			);
		}

		return <div className={styles.label}>{label}</div>;
	};

	renderList = (searchValue: string) => {
		const {loading, options, value} = this.props;

		return (
			<List
				getOptionLabel={this.getOptionLabel}
				getOptionValue={this.getOptionValue}
				loading={loading}
				onSelect={this.handleSelect}
				options={options}
				searchValue={searchValue}
				value={value}
			/>
		);
	};

	renderLoader = () => this.props.loading ? <Loader size={15} /> : null;

	renderMenu = () => {
		const {components, isSearching, loading, options} = this.props;
		const {showMenu} = this.state;
		const {Menu = this.renderDefaultMenu} = components;

		if (showMenu) {
			return (
				<OutsideClickDetector onClickOutside={this.hideMenu}>
					<Menu
						className={styles.menu}
						isSearching={isSearching}
						loading={loading}
						onSelect={this.handleSelect}
						options={options}
					/>
				</OutsideClickDetector>
			);
		}
	};

	renderValueContainer = () => (
		<div className={styles.valueContainer} onClick={this.handleClick}>
			{this.renderLabel()}
			{this.renderLoader()}
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
