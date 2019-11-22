// @flow
import {ATTR_PROPS, DEFAULT_COMPONENTS} from './constants';
import {Button, IconButton} from 'components/atoms';
import {EditIcon, PlusIcon} from 'icons/form';
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
		isLoading: false,
		isSearchable: true,
		withCreateButton: false,
		withEditIcon: false
	};

	state = {
		showForm: false
	};

	ref = createRef();

	getComponents = () => {
		const {components, form, withCreateButton} = this.props;
		let commonComponents = {
			SingleValue: this.renderSingleValue,
			...DEFAULT_COMPONENTS,
			...components
		};

		if (form) {
			commonComponents = {...commonComponents, ValueContainer: this.renderValue};
		}

		if (withCreateButton) {
			commonComponents = {...commonComponents, Menu: this.renderListWithCreateButton};
		}

		return commonComponents;
	};

	getCustomStyles = () => {
		const {attr} = this.props;
		const customStyles = {};

		customStyles.control = (provided: Object) => {
			provided.border = attr ? 'none' : '1px solid lightgray';
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

	handleSelect = (value: OptionType) => {
		const {onSelect, name} = this.props;
		const {current} = this.ref;

		// Необходимо сбивать фокус для корректной работы на IE и EDGE
		if (current) {
			current.blur();
		}

		onSelect(name, value);
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

	mask = (value: string) => value.length > 18 ? `${value.substring(0, 18)}...` : value;

	stopPropagation = (e: SyntheticMouseEvent<HTMLElement>) => e.stopPropagation();

	renderEditIcon = () => {
		const {withEditIcon} = this.props;

		if (withEditIcon) {
			return (
				<div className={styles.editIconContainer} onClick={this.handleShowForm(true)} onMouseDown={this.stopPropagation}>
					<IconButton>
						<EditIcon />
					</IconButton>
				</div>
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

	renderListWithCreateButton = (props: any) => {
		const {createButtonText, onClickCreateButton} = this.props;

		return (
			<components.Menu {...props}>
				{props.children}
				<Button className="m-1" onClick={onClickCreateButton || this.handleShowForm(true)}>
					<PlusIcon className={styles.plusIcon} />
					{createButtonText}
				</Button>
			</components.Menu>
		);
	};

	renderSelect = () => <ReactSelect ref={this.ref} {...this.getSelectProps()} />;

	renderSingleValue = ({ children, ...props }: any) => (
		<components.SingleValue {...props}>
			{this.mask(children)}
		</components.SingleValue>
	);

	renderValue = ({children, ...props}: any) => (
			<components.ValueContainer {...props} className={styles.valueContainer}>
				<div>{children}</div>
				{this.renderEditIcon()}
			</components.ValueContainer>
	);

	render () {
		const {showForm} = this.state;

		return showForm ? this.renderForm() : this.renderSelect();
	}
}

export default Select;
