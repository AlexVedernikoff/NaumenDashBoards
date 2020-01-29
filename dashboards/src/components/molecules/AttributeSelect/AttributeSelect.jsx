// @flow
import type {Attribute} from 'store/sources/attributes/types';
import cn from 'classnames';
import {CreationPanel, IconButton, OutsideClickDetector, SearchSelectInput} from 'components/atoms';
import {EditIcon, MinusIcon} from 'icons/form';
import {InputForm, SimpleSelectList} from 'components/molecules';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class AttributeSelect extends PureComponent<Props, State> {
	static defaultProps = {
		defaultValue: {
			title: 'Выберите значение',
			value: ''
		},
		disabled: false,
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

	handleClickEditIcon = () => this.setState({showForm: true, showMenu: false});

	handleClickOutside = () => this.setState({showMenu: false});

	handleCloseForm = () => this.setState({showForm: false});

	handleChangeSearchInput = (searchValue: string) => {
		const {options} = this.props;
		const reg = new RegExp(searchValue, 'i');
		const foundOptions = options.filter(o => reg.test(o.title));

		this.setState({foundOptions, searchValue});
	};

	handleClickRemoveIcon = () => {
		const {name, onRemove, onSelect} = this.props;
		onRemove ? onRemove(name) : onSelect(name, null);
	};

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

	renderCreationPanel = () => {
		const {onClickCreationButton, showCreationButton} = this.props;

		if (showCreationButton) {
			return <CreationPanel text="Cоздать поле" onClick={onClickCreationButton} />;
		}
	};

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
	};

	renderIndicators = () => (
		<div className={styles.indicators}>
			{this.renderEditIcon()}
			{this.renderRemoveIcon()}
		</div>
	);

	renderList = () => {
		const {options, value} = this.props;
		const {foundOptions, searchValue} = this.state;
		const renderOptions = searchValue ? foundOptions : options;
		const messages = {
			noOptions: 'Список атрибутов пуст'
		};

		return (
			<SimpleSelectList
				getOptionLabel={this.getOptionLabel}
				getOptionValue={this.getOptionValue}
				isSearching={!!searchValue}
				messages={messages}
				onSelect={this.handleSelect}
				options={renderOptions}
				value={value}
			/>
		);
	};

	renderMenu = () => {
		const {showMenu} = this.state;

		if (showMenu) {
			return (
				<div className={styles.menu}>
					{this.renderSearchListInput()}
					{this.renderList()}
					{this.renderCreationPanel()}
				</div>
			);
		}
	};

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

	renderSearchListInput = () => {
		const {options} = this.props;
		const {searchValue} = this.state;

		if (options.length > 0) {
			return <SearchSelectInput onChange={this.handleChangeSearchInput} value={searchValue} />;
		}
	};

	renderSelect = () => {
		const {disabled} = this.props;
		const selectCN = cn({
			[styles.select]: true,
			[styles.disabledSelect]: disabled
		});

		return (
			<OutsideClickDetector onClickOutside={this.handleClickOutside}>
				<div className={selectCN}>
					{this.renderTitle()}
					{this.renderIndicators()}
					{this.renderMenu()}
				</div>
			</OutsideClickDetector>
		);
	};

	renderTitle = () => {
		const {defaultValue, value} = this.props;
		const title = value ? value.title : defaultValue.title;
		const titleCN = cn({
			[styles.title]: true,
			[styles.defaultTitle]: !value
		});

		return <div className={titleCN} onClick={this.handleShowMenu}>{title}</div>;
	};

	render () {
		return this.state.showForm ? this.renderForm() : this.renderSelect();
	}
}

export default AttributeSelect;
