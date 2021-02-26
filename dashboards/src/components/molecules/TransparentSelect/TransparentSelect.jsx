// @flow
import type {Attribute} from 'store/sources/attributes/types';
import cn from 'classnames';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import Label from 'components/atoms/Label';
import LabelEditingForm from 'components/molecules/InputForm';
import List from 'components/molecules/Select/components/List';
import Loader from 'components/atoms/Loader';
import Menu from 'components/molecules/Select/components/Menu';
import OutsideClickDetector from 'components/atoms/OutsideClickDetector';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class TransparentSelect extends PureComponent<Props, State> {
	static defaultProps = {
		async: false,
		className: '',
		components: {},
		disabled: false,
		error: false,
		loading: false,
		options: [],
		placeholder: 'Выберите значение',
		removable: false,
		showCreationButton: false,
		uploaded: false
	};

	state = {
		showForm: false,
		showMenu: false
	};

	fetchOptions = () => {
		const {async, error, fetchOptions, loading, uploaded} = this.props;

		if (async && typeof fetchOptions === 'function' && (error || loading || uploaded) === false) {
			fetchOptions();
		}
	};

	handleClickEditIcon = () => this.setState({showForm: true, showMenu: false});

	handleClickRemoveIcon = () => {
		const {name, onRemove} = this.props;

		onRemove(name);
	};

	handleCloseForm = () => this.setState({showForm: false});

	handleSelect = (value: Attribute) => {
		const {name, onSelect} = this.props;

		onSelect({name, value});
		this.setState({showMenu: false});
	};

	handleShowMenu = () => this.setState({showMenu: !this.state.showMenu});

	handleSubmitForm = (label: string) => {
		const {name, onChangeLabel} = this.props;

		onChangeLabel({label, name});
		this.setState({showForm: false});
	};

	hideMenu = () => this.setState({showMenu: false});

	renderEditIcon = () => {
		const {value} = this.props;

		if (value) {
			return <IconButton icon={ICON_NAMES.EDIT} onClick={this.handleClickEditIcon} />;
		}
	};

	renderIndicators = () => (
		<div className={styles.indicators}>
			{this.renderEditIcon()}
			{this.renderRemoveIcon()}
		</div>
	);

	renderLabelEditingForm = () => {
		const {getOptionLabel, value} = this.props;

		if (value) {
			return (
				<div className={styles.form}>
					<LabelEditingForm
						onClose={this.handleCloseForm}
						onSubmit={this.handleSubmitForm}
						value={getOptionLabel(value)}
					/>
				</div>
			);
		}

		return null;
	};

	renderList = (searchValue: string) => {
		const {components, getOptionLabel, getOptionValue, loading, options, value} = this.props;
		const {List: Component = List} = components;

		return (
			<Component
				getOptionLabel={getOptionLabel}
				getOptionValue={getOptionValue}
				loading={loading}
				onSelect={this.handleSelect}
				options={options}
				searchValue={searchValue}
				value={value}
			/>
		);
	};

	renderLoader = () => this.props.loading ? <Loader /> : null;

	renderMenu = () => {
		const {onClickCreationButton, showCreationButton} = this.props;
		const {showMenu} = this.state;
		let creationButton;

		if (showCreationButton) {
			creationButton = {
				onClick: onClickCreationButton,
				text: 'Создать поле'
			};
		}

		if (showMenu) {
			this.fetchOptions();

			return (
				<OutsideClickDetector onClickOutside={this.hideMenu}>
					<Menu creationButton={creationButton} isSearching={true} renderList={this.renderList} />
				</OutsideClickDetector>
			);
		}
	};

	renderPlaceholder = () => {
		const {placeholder, value} = this.props;

		if (!value) {
			return (
				<div className={styles.placeholder} onClick={this.handleShowMenu}>
					{placeholder}
				</div>
			);
		}
	};

	renderRemoveIcon = () => {
		const {removable} = this.props;

		if (removable) {
			return (
				<IconButton icon={ICON_NAMES.MINUS} onClick={this.handleClickRemoveIcon} />
			);
		}
	};

	renderSelect = () => {
		const {className, disabled} = this.props;
		const selectCN = cn({
			[styles.select]: true,
			[styles.disabledSelect]: disabled
		}, className);

		return (
			<div className={selectCN}>
				{this.renderValueContainer()}
				{this.renderMenu()}
			</div>
		);
	};

	renderValue = () => {
		const {getOptionLabel, note, value} = this.props;

		if (value) {
			return (
				<div className={styles.labelContainer} onClick={this.handleShowMenu}>
					<Label>{note}</Label>
					<Label className={styles.label}>{getOptionLabel(value)}</Label>
				</div>
			);
		}
	};

	renderValueContainer = () => (
		<div className={styles.valueContainer}>
			{this.renderValue()}
			{this.renderPlaceholder()}
			{this.renderLoader()}
			{this.renderIndicators()}
		</div>
	);

	render () {
		return this.state.showForm ? this.renderLabelEditingForm() : this.renderSelect();
	}
}

export default TransparentSelect;
