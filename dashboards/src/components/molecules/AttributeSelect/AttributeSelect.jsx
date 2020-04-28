// @flow
import type {Attribute} from 'store/sources/attributes/types';
import cn from 'classnames';
import {EditIcon, MinusIcon} from 'icons/form';
import {IconButton, Label, Loader, OutsideClickDetector} from 'components/atoms';
import {InputForm, SimpleSelectMenu} from 'components/molecules';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class AttributeSelect extends PureComponent<Props, State> {
	static defaultProps = {
		disabled: false,
		loading: false,
		placeholder: 'Выберите значение',
		removable: false,
		showCreationButton: false
	};

	state = {
		foundOptions: [],
		searchValue: '',
		showForm: false,
		showMenu: false
	};

	getOptionLabel = (attribute: Attribute) => attribute.title;

	getOptionValue = (attribute: Attribute) => attribute.code;

	handleChangeSearchInput = (searchValue: string) => {
		const {options} = this.props;
		const reg = new RegExp(searchValue, 'i');
		const foundOptions = options.filter(o => reg.test(o.title));

		this.setState({foundOptions, searchValue});
	};

	handleClickEditIcon = () => this.setState({showForm: true, showMenu: false});

	handleClickRemoveIcon = () => {
		const {name, onRemove, onSelect} = this.props;
		onRemove ? onRemove(name) : onSelect(name, null);
	};

	handleCloseForm = () => this.setState({showForm: false});

	handleSelect = (value: Attribute) => {
		const {name, onSelect} = this.props;

		onSelect(name, value);
		this.setState({showMenu: false});
	};

	handleShowMenu = () => this.setState({showMenu: !this.state.showMenu});

	handleSubmitForm = (title: string) => {
		const {name, onChangeTitle} = this.props;

		onChangeTitle(name, title);
		this.setState({showForm: false});
	};

	hideMenu = () => this.setState({showMenu: false});

	renderEditIcon = () => {
		const {value} = this.props;

		if (value) {
			return (
				<IconButton onClick={this.handleClickEditIcon}>
					<EditIcon />
				</IconButton>
			);
		}
	};

	renderForm = () => {
		const {value} = this.props;

		if (value) {
			return (
				<div className={styles.form}>
					<InputForm
						onClose={this.handleCloseForm}
						onSubmit={this.handleSubmitForm}
						value={value.title}
					/>
				</div>
			);
		}

		return null;
	};

	renderIndicators = () => (
		<div className={styles.indicators}>
			{this.renderEditIcon()}
			{this.renderRemoveIcon()}
		</div>
	);

	renderLoader = () => this.props.loading ? <Loader className={styles.loader} /> : null;

	renderMenu = () => {
		const {onClickCreationButton, options, showCreationButton, value} = this.props;
		const {foundOptions, searchValue, showMenu} = this.state;
		const renderOptions = searchValue ? foundOptions : options;
		let creationButton;

		if (showCreationButton) {
			creationButton = {
				onClick: onClickCreationButton,
				text: 'Создать поле'
			};
		}

		if (showMenu) {
			return (
				<SimpleSelectMenu
					creationButton={creationButton}
					getOptionLabel={this.getOptionLabel}
					getOptionValue={this.getOptionValue}
					isSearching={true}
					onClose={this.hideMenu}
					onSelect={this.handleSelect}
					options={renderOptions}
					value={value}
				/>
			);
		}
	};

	renderPlaceholder = () => (
		<div className={styles.placeholder} onClick={this.handleShowMenu}>
			{this.props.placeholder}
		</div>
	);

	renderRemoveIcon = () => {
		const {removable} = this.props;

		if (removable) {
			return (
				<IconButton onClick={this.handleClickRemoveIcon}>
					<MinusIcon />
				</IconButton>
			);
		}
	};

	renderSelect = () => {
		const {disabled} = this.props;
		const selectCN = cn({
			[styles.select]: true,
			[styles.disabledSelect]: disabled
		});

		return (
			<OutsideClickDetector onClickOutside={this.hideMenu}>
				<div className={selectCN}>
					{this.renderValue()}
					{this.renderLoader()}
					{this.renderIndicators()}
					{this.renderMenu()}
				</div>
			</OutsideClickDetector>
		);
	};

	renderTitle = () => {
		const {note, value} = this.props;
		const titleCN = cn({
			[styles.title]: true
		});
		let title = '';

		if (value) {
			title = value.title;
		}

		return (
			<div className={styles.titleContainer} onClick={this.handleShowMenu}>
				<Label text={note} />
				<Label className={titleCN} text={title} />
			</div>
		);
	};

	renderValue = () => this.props.value ? this.renderTitle() : this.renderPlaceholder();

	render () {
		return this.state.showForm ? this.renderForm() : this.renderSelect();
	}
}

export default AttributeSelect;
