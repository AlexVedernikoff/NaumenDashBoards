// @flow
import {ATTR_PROPS, DEFAULT_COMPONENTS, SELECT_SIZE} from './constants';
import {Button} from 'components/atoms';
import {EditIcon} from 'icons/form';
import {InputForm} from 'components/molecules';
import type {OptionType} from 'react-select/src/types';
import type {Props, State} from './types';
import React, {Component, Fragment} from 'react';
import ReactSelect, {components} from 'react-select';
import styles from './styles.less';

export class Select extends Component<Props, State> {
	static defaultProps = {
		attr: false,
		createButtonText: 'Создать',
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

	renderForm = () => {
		const {form} = this.props;

		if (form) {
			const {rule, value} = form;

			return (
				<InputForm
					onClose={this.handleShowForm(false)}
					onSubmit={this.handleSubmit}
					rule={rule}
					value={value}
				/>
			);
		}
	};

	renderValue = (title: string) => {
		const {withEditIcon} = this.props;

		if (withEditIcon) {
			return (
				<Fragment>
					<div>{title}</div>
					<EditIcon
						className={styles.editIcon}
						onMouseDown={this.stopPropagation}
						onClick={this.handleShowForm(true)}
					/>
				</Fragment>
			);
		}

		return title;
	};

	renderFormContainer = ({children, ...props}: any) => {
		const {showForm} = this.state;

		return (
			<components.ValueContainer {...props}>
				{showForm ? this.renderForm() : this.renderValue(children)}
			</components.ValueContainer>
		);
	};

	renderListWithCreateButton = (props: any) => {
		const {createButtonText, onClickCreateButton} = this.props;

		return (
			<Fragment>
				<components.MenuList {...props}>
					<Button className="m-1" onClick={onClickCreateButton || this.handleShowForm(true)}>
						{createButtonText}
					</Button>
					{props.children}
				</components.MenuList>
			</Fragment>
		);
	};

	noOptionsMessage = () => 'Список пуст';

	handleSelect = (value: OptionType) => {
		const {onSelect, name} = this.props;
		onSelect(name, value);
	};

	additionalProps = (): Object => {
		let {attr, getOptionLabel, getOptionValue} = this.props;
		let props = {getOptionLabel, getOptionValue};

		return attr ? ATTR_PROPS : props;
	};

	getComponents = () => {
		const {components, form, withCreateButton} = this.props;
		let commonComponents = {...DEFAULT_COMPONENTS, ...components};

		if (form) {
			commonComponents = {...commonComponents, ValueContainer: this.renderFormContainer};
		}

		if (withCreateButton) {
			commonComponents = {...commonComponents, MenuList: this.renderListWithCreateButton};
		}

		return commonComponents;
	};

	render () {
		const {isLoading, isSearchable, options, placeholder, size, value} = this.props;
		const {showForm} = this.state;
		const selectCN = size === SELECT_SIZE.SMALL && 'dashboard__select__small';

		return (
			<ReactSelect
				className={selectCN}
				classNamePrefix="dashboard__select"
				components={this.getComponents()}
				isLoading={isLoading}
				isSearchable={isSearchable && !showForm}
				noOptionsMessage={this.noOptionsMessage}
				onChange={this.handleSelect}
				options={options}
				placeholder={placeholder}
				value={value}
				{...this.additionalProps()}
			/>
		);
	}
}

export default Select;
