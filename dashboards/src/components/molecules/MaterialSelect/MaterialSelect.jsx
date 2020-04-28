// @flow
import {MultiValueContainer, ValueContainer} from './components';
import type {Option, Props, State} from './types';
import {OutsideClickDetector} from 'components/atoms';
import React, {PureComponent} from 'react';
import {SimpleSelectMenu} from 'components/molecules';
import styles from './styles.less';

export class MaterialSelect extends PureComponent<Props, State> {
	static defaultProps = {
		async: false,
		focusOnSearch: false,
		isEditingLabel: false,
		isSearching: false,
		loading: false,
		maxLabelLength: NaN,
		multiple: false,
		name: '',
		placeholder: 'Выберите значение',
		showCreationButton: false,
		showMore: false,
		textCreationButton: 'Создать',
		value: null,
		values: []
	};

	state = {
		optionsLoaded: false,
		showMenu: false
	};

	getOptionLabel = (option: Object) => {
		const {getOptionLabel} = this.props;
		let label = '';

		if (option) {
			label = getOptionLabel ? getOptionLabel(option) : option.label;
		}

		return label;
	};

	getOptionValue = (option: Object) => {
		const {getOptionValue} = this.props;
		let value = '';

		if (option) {
			value = getOptionValue ? getOptionValue(option) : option.value;
		}

		return value;
	};

	handleChangeLabel = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {onChangeLabel, value: currentValue} = this.props;
		const {value} = e.currentTarget;

		if (currentValue && onChangeLabel) {
			onChangeLabel(this.getOptionValue(currentValue), value);
		}
	};

	handleClickCreationButton = () => {
		const {onClickCreationButton} = this.props;

		this.setState({showMenu: false});
		onClickCreationButton && onClickCreationButton();
	};

	handleClickValue = () => {
		const {async, onLoadOptions, options} = this.props;
		const {optionsLoaded, showMenu} = this.state;

		if (async && !optionsLoaded && options.length === 0 && onLoadOptions) {
			this.setState({optionsLoaded: true});
			onLoadOptions();
		}

		this.setState({showMenu: !showMenu});
	};

	handleSelect = (value: Option) => {
		const {multiple, name, onSelect} = this.props;

		if (!multiple) {
			this.setState({showMenu: false});
		}

		onSelect(name, value);
	};

	hideMenu = () => this.setState({showMenu: false});

	renderMenu = () => {
		const {
			focusOnSearch,
			getOptionLabel,
			getOptionValue,
			isSearching,
			multiple,
			options,
			showCreationButton,
			textCreationButton,
			value,
			values
		} = this.props;
		const {showMenu} = this.state;
		let creationButton;

		if (showCreationButton) {
			creationButton = {
				onClick: this.handleClickCreationButton,
				text: textCreationButton
			};
		}

		if (showMenu) {
			return (
				<SimpleSelectMenu
					className={styles.menu}
					creationButton={creationButton}
					focusOnSearch={focusOnSearch}
					getOptionLabel={getOptionLabel}
					getOptionValue={getOptionValue}
					isSearching={isSearching}
					multiple={multiple}
					onClose={this.hideMenu}
					onSelect={this.handleSelect}
					options={options}
					value={value}
					values={values}
				/>
			);
		}
	};

	renderMultiValueContainer = () => {
		const {onClear, onRemove, values} = this.props;

		return (
			<MultiValueContainer
				getOptionLabel={this.getOptionLabel}
				getOptionValue={this.getOptionValue}
				onClear={onClear}
				onClick={this.handleClickValue}
				onRemove={onRemove}
				values={values}
			/>
		);
	};

	renderSimpleValueContainer = () => {
		const {forwardedLabelInputRef, isEditingLabel, maxLabelLength, placeholder, value} = this.props;

		return (
			<ValueContainer
				editableLabel={isEditingLabel}
				forwardedInputRef={forwardedLabelInputRef}
				getOptionLabel={this.getOptionLabel}
				getOptionValue={this.getOptionValue}
				label={this.getOptionLabel(value)}
				maxLabelLength={maxLabelLength}
				onChangeLabel={this.handleChangeLabel}
				onClick={this.handleClickValue}
				placeholder={placeholder}
				value={value}
			/>
		);
	};

	renderValueContainer = () => this.props.multiple ? this.renderMultiValueContainer() : this.renderSimpleValueContainer();

	render () {
		return (
			<OutsideClickDetector onClickOutside={this.hideMenu}>
				<div className={styles.container}>
					{this.renderValueContainer()}
					{this.renderMenu()}
				</div>
			</OutsideClickDetector>
		);
	}
}

export default MaterialSelect;
