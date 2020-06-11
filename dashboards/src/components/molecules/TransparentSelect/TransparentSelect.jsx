// @flow
import type {Attribute} from 'store/sources/attributes/types';
import cn from 'classnames';
import {IconButton, Label, Loader, OutsideClickDetector} from 'components/atoms';
import {ICON_NAMES} from 'components/atoms/Icon';
import {InputForm as LabelEditingForm, SimpleSelectMenu} from 'components/molecules';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class TransparentSelect extends PureComponent<Props, State> {
	static defaultProps = {
		async: false,
		className: '',
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
		foundOptions: [],
		searchValue: '',
		showForm: false,
		showMenu: false
	};

	handleChangeSearchInput = (searchValue: string) => {
		const {getOptionLabel, options} = this.props;
		const reg = new RegExp(searchValue, 'i');
		const foundOptions = options.filter(o => reg.test(getOptionLabel(o)));

		this.setState({foundOptions, searchValue});
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

		onChangeLabel({name, label});
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

	renderLoader = () => this.props.loading ? <Loader className={styles.loader} /> : null;

	renderMenu = () => {
		const {
			async,
			error,
			fetchOptions,
			getOptionLabel,
			getOptionValue,
			loading,
			onClickCreationButton,
			options,
			showCreationButton,
			uploaded,
			value
		} = this.props;
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
			if (async && typeof fetchOptions === 'function' && (error || loading || uploaded) === false) {
				fetchOptions();
			}

			return (
				<OutsideClickDetector onClickOutside={this.hideMenu}>
					<SimpleSelectMenu
						creationButton={creationButton}
						getOptionLabel={getOptionLabel}
						getOptionValue={getOptionValue}
						isSearching={true}
						onClose={this.hideMenu}
						onSelect={this.handleSelect}
						options={renderOptions}
						value={value}
					/>
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
					<Label text={note} />
					<Label className={styles.label} text={getOptionLabel(value)} />
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
