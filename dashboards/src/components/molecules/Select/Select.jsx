// @flow
import {ATTR_PROPS, DEFAULT_COMPONENTS, SELECT_SIZE} from './constants';
import {Button, IconButton} from 'components/atoms';
import {EditIcon} from 'icons/form';
import {InputForm} from 'components/molecules';
import type {OptionType} from 'react-select/src/types';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import ReactSelect, {components} from 'react-select';
import styles from './styles.less';

export class Select extends PureComponent<Props, State> {
	static defaultProps = {
		attr: false,
		border: true,
		color: 'white',
		createButtonText: 'Создать',
		defaultValue: null,
		isDisabled: false,
		isLoading: false,
		isSearchable: true,
		size: SELECT_SIZE.NORMAL,
		withCreateButton: false,
		withEditIcon: false
	};

	state = {
		showForm: false
	};

	noOptionsMessage = () => 'Список пуст';

	handleSelect = (value: OptionType) => {
		const {onSelect, name} = this.props;
		onSelect(name, value);
	};

	getComponents = () => {
		const {components, form, withCreateButton} = this.props;
		let commonComponents = {...DEFAULT_COMPONENTS, ...components};

		if (form) {
			commonComponents = {...commonComponents, ValueContainer: this.renderValue};
		}

		if (withCreateButton) {
			commonComponents = {...commonComponents, Menu: this.renderListWithCreateButton};
		}

		return commonComponents;
	};

	getCustomStyles = () => {
		const {border, color} = this.props;
		const customStyles = {};

		customStyles.control = (provided: Object) => {
			const styles = {
				background: 'white',
				border: '1px solid lightgray',
				borderRadius: 2,
				boxShadow: 'none',
				'&:hover': {
					borderColor: 'gray'
				}
			};

			if (!border) {
				styles.border = 'none';
				styles.borderRadius = 0;
			}

			if (color === 'blue') {
				styles.background = '#EFF3F8';
			}

			return {
				...provided,
				...styles
			};
		};

		return customStyles;
	};

	getSelectProps = (): Object => {
		const {attr, defaultValue, getOptionLabel, getOptionValue, isDisabled, isLoading, isSearchable, options, placeholder, value} = this.props;
		let props = {
			classNamePrefix: 'dashboard__select',
			components: this.getComponents(),
			defaultValue,
			getOptionLabel,
			getOptionValue,
			isDisabled,
			isLoading,
			isSearchable,
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

	handleSubmit = (value: string) => {
		const {name, form} = this.props;

		if (form) {
			form.onSubmit(name, value);
		}

		this.handleShowForm(false)();
	};

	stopPropagation = (e: SyntheticMouseEvent<HTMLElement>) => {
		e.stopPropagation();
	};

	handleShowForm = (showForm: boolean) => () => this.setState({showForm});

	renderEditIcon = () => {
		const {withEditIcon} = this.props;

		if (withEditIcon) {
			return (
				<div className={styles.editIconContainer} onMouseDown={this.stopPropagation} onClick={this.handleShowForm(true)}>
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
			<Fragment>
				<components.Menu {...props}>
					{props.children}
					<Button className="m-1" onClick={onClickCreateButton || this.handleShowForm(true)}>
						{createButtonText}
					</Button>
				</components.Menu>
			</Fragment>
		);
	};

	renderSelect = () => {
		const props = this.getSelectProps();

		return (
			<ReactSelect {...props} />
		);
	};

	renderValue = ({children, ...props}: any) => (
		<components.ValueContainer {...props}>
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
