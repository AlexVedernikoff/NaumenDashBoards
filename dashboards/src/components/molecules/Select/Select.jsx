// @flow
import {ATTR_PROPS, DEFAULT_COMPONENTS} from './constants';
import {CreationPanel, IconButton} from 'components/atoms';
import {EditIcon, MinusIcon} from 'icons/form';
import {InputForm} from 'components/molecules';
import type {OptionType} from 'react-select/src/types';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import ReactSelect, {components} from 'react-select';
import styles from './styles.less';

export class Select extends PureComponent<Props, State> {
	static defaultProps = {
		attr: false,
		createButtonText: 'Создать',
		defaultValue: null,
		isDisabled: false,
		isEditableLabel: true,
		isLoading: false,
		isRemovable: false,
		isSearchable: true,
		placeholder: 'Выберите значение',
		showBorder: true,
		withCreate: false
	};

	state = {
		showForm: false
	};

	ref = createRef();

	getComponents = () => {
		const {components, withCreate} = this.props;
		const commonComponents = {
			Control: this.renderControl,
			IndicatorsContainer: this.renderIndicators,
			...DEFAULT_COMPONENTS,
			...components
		};

		if (withCreate) {
			commonComponents.Menu = this.renderListWithCreateButton;
		}

		return commonComponents;
	};

	getCustomStyles = () => {
		const {showBorder} = this.props;
		const customStyles = {};

		customStyles.control = (provided: Object) => {
			provided.border = showBorder ? '1px solid lightgray' : 'none';
			return provided;
		};

		return customStyles;
	};

	getSelectProps = (): Object => {
		const {
			attr,
			defaultValue,
			getOptionLabel,
			getOptionValue,
			isDisabled,
			isLoading,
			isSearchable,
			menuIsOpen,
			options,
			placeholder,
			value
		} = this.props;
		let props = {
			classNamePrefix: 'dashboard__select',
			components: this.getComponents(),
			defaultValue,
			getOptionLabel,
			getOptionValue,
			isDisabled,
			isLoading,
			isSearchable,
			menuIsOpen,
			noOptionsMessage: this.noOptionsMessage,
			onChange: this.handleSelect,
			options,
			placeholder,
			styles: this.getCustomStyles(),
			value
		};

		if (attr) {
			props = {...props, ...ATTR_PROPS};
		}

		return props;
	};

	handleRemove = () => {
		const {name, onRemove, onSelect} = this.props;
		onRemove ? onRemove(name) : onSelect(name, null);
	};

	handleSelect = (value: OptionType) => {
		const {onSelect, name} = this.props;
		const {current} = this.ref;

		// Необходимо сбивать фокус для корректной работы на IE и EDGE
		if (current) {
			current.blur();
		}

		onSelect(name, {...value});
	};

	handleShowForm = (showForm: boolean) => () => this.setState({showForm});

	handleSubmit = (value: string) => {
		const {name, form} = this.props;

		if (form) {
			form.onSubmit(name, value);
		}

		this.handleShowForm(false)();
	};

	noOptionsMessage = () => 'Список пуст';

	stopPropagation = (e: SyntheticMouseEvent<HTMLElement>) => e.stopPropagation();

	renderControl = (props: any) => <components.Control {...props} className={styles.control}/>;

	renderEditIcon = () => {
		const {isEditableLabel, value} = this.props;

		if (isEditableLabel && value) {
			return (
				<IconButton onClick={this.handleShowForm(true)}>
					<EditIcon />
				</IconButton>
			);
		}
	};

	renderForm = () => {
		const {form} = this.props;

		if (form) {
			const {rule, value} = form;

			return (
				<div className={styles.formContainer}>
					<InputForm
						onClose={this.handleShowForm(false)}
						onSubmit={this.handleSubmit}
						rule={rule}
						value={value}
					/>
				</div>
			);
		}
	};

	renderIndicators = () => (
		<div className={styles.indicatorsContainer} onMouseDown={this.stopPropagation}>
			{this.renderEditIcon()}
			{this.renderRemoveIcon()}
		</div>
	);

	renderListWithCreateButton = (props: Object) => {
		const {createButtonText, onClickCreateButton} = this.props;

		return (
			<components.Menu {...props}>
				{props.children}
				<CreationPanel onClick={onClickCreateButton || this.handleShowForm(true)} text={createButtonText} />
			</components.Menu>
		);
	};

	renderRemoveIcon = () => {
		const {isRemovable} = this.props;

		if (isRemovable) {
			return (
				<IconButton onClick={this.handleRemove}>
					<MinusIcon />
				</IconButton>
			);
		}
	};

	renderSelect = () => <ReactSelect ref={this.ref} {...this.getSelectProps()} />;

	render () {
		const {showForm} = this.state;

		return showForm ? this.renderForm() : this.renderSelect();
	}
}

export default Select;
