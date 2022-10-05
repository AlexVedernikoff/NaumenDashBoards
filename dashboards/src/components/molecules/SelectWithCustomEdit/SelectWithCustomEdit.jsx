// @flow
import Container from 'components/atoms/Container';
import type {DefaultProps, Props, State} from './types';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {InputRef} from 'components/types';
import LabelEditingForm from 'components/molecules/InputForm';
import React, {Component, createRef} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';
import t from 'localization';

class SelectWithCustomEdit extends Component<Props, State> {
	static defaultProps: DefaultProps = {
		clearing: false,
		customOptionsLabel: 'SelectWithCustomEdit::UserOption',
		emptyAsNotUsed: true,
		name: '',
		placeholder: ''
	};

	inputRef: InputRef = createRef();
	state = {
		showForm: false
	};

	getOptions = () => {
		const {customOptionsLabel, options, placeholder, value} = this.props;

		if (options) {
			const customOptions = value && !options.includes(value)
				? {label: value, value}
				: {label: t(customOptionsLabel), value: ''};
			const extendedOptions = [
				{label: placeholder, value: null},
				...options.map(item => ({label: item.trimLeft(), value: item})),
				customOptions
			];

			return {
				options: extendedOptions,
				value: extendedOptions.find(item => item.value === value)
			};
		}

		return {
			options: [],
			value: null
		};
	};

	getSelectComponents = () => ({
		IndicatorsContainer: this.renderIndicatorsContainer
	});

	handleClearValue = (e?: MouseEvent) => {
		const {name, onSelect} = this.props;

		if (onSelect) {
			onSelect({name, value: null});
		}

		e && e.stopPropagation();
	};

	handleCloseForm = () => {
		this.setState({showForm: false});
	};

	handleSelect = ({value: selectValue}) => {
		const {name, onSelect, options} = this.props;
		const {value} = selectValue;

		if (value !== null && (value === '' || !options.includes(value))) {
			this.showForm();
		} else if (onSelect) {
			onSelect({name, value});
		}
	};

	handleSubmitForm = (value: string, callback?: Function) => {
		const {name, onSelect} = this.props;

		if (onSelect) {
			const newValue = value === '' ? null : value;

			onSelect({name, value: newValue}, callback);
		}

		this.setState({showForm: false});
	};

	showForm = () => {
		this.setState({showForm: true}, () => {
			const {current} = this.inputRef;

			current && current.focus();
		});
	};

	renderClearButton = () => {
		const {value} = this.props;

		if (value) {
			return <IconButton icon={ICON_NAMES.CLOSE} onClick={this.handleClearValue} />;
		}

		return null;
	};

	renderForm = () => {
		const {value} = this.props;

		return (
			<LabelEditingForm
				className={styles.form}
				forwardedRef={this.inputRef}
				onClose={this.handleCloseForm}
				onSubmit={this.handleSubmitForm}
				value={value ?? ''}
			/>
		);
	};

	renderIndicatorsContainer = props => {
		const {children, ...containerProps} = props;
		return (
			<Container {...containerProps}>
				{this.renderClearButton()}
				{children}
			</Container>
		);
	};

	renderSelect = () => {
		const {name, placeholder} = this.props;
		const {options, value} = this.getOptions();
		return (
			<Select
				components={this.getSelectComponents()}
				name={name}
				onSelect={this.handleSelect}
				options={options}
				placeholder={placeholder}
				value={value}
			/>
		);
	};

	render () {
		const {showForm} = this.state;

		return showForm ? this.renderForm() : this.renderSelect();
	}
}

export default SelectWithCustomEdit;
