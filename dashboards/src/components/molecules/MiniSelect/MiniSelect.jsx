// @flow
import {ChevronDownBareIcon as CaretIcon} from 'icons/form';
import cn from 'classnames';
import type {Label, Option, Props, State} from './types';
import React, {createElement, PureComponent} from 'react';
import styles from './styles.less';

export class MiniSelect extends PureComponent<Props, State> {
	static defaultProps = {
		isDisabled: false,
		showCaret: true
	};

	state = {
		active: false,
		currentOption: {
			label: '[Не выбрано]',
			value: ''
		}
	};

	static getDerivedStateFromProps (props: Props, state: State) {
		const {options, value} = props;
		const {currentOption} = state;

		if (currentOption.value !== value) {
			state.currentOption = options.find(o => o.value === value) || options[0];
		}

		return state;
	}

	handleClick = (e: SyntheticMouseEvent<HTMLDivElement>) => {
		const {name, onSelect} = this.props;

		onSelect(name, e.currentTarget.dataset.value);
		this.hideList();
	};

	handleShowList = () => this.setState(state => ({active: !state.active}));

	hideList = () => this.setState({active: false});

	isNotCurrent = (option: Option) => option.value !== this.state.currentOption.value;

	renderCaret = () => this.props.showCaret && <CaretIcon className={styles.caret} />;

	renderLabel = (label: Label) => {
		if (typeof label === 'function') {
			label = createElement(label);
		}

		return <div className={styles.label}>{label}</div>;
	};

	renderList = () => {
		const {active} = this.state;

		if (active) {
			return (
				<div className={styles.list}>
					{this.renderValue()}
					{this.renderOptions()}
				</div>
			);
		}
	};

	renderOption = (option: Option) => {
		const {label, value} = option;

		return (
			<div className={styles.option} data-value={value} key={value} onClick={this.handleClick}>
				{this.renderLabel(label)}
			</div>
		);
	};

	renderOptions = () => this.props.options.filter(this.isNotCurrent).map(this.renderOption);

	renderSelect = () => {
		const {isDisabled} = this.props;
		const CNSelect = [styles.select];

		if (isDisabled) {
			CNSelect.push(styles.disabled);
		}

		return (
			<div className={cn(CNSelect)} onBlur={this.hideList} tabIndex={0}>
				{this.renderValue()}
				{this.renderList()}
			</div>
		);
	};

	renderValue = () => {
		const {currentOption} = this.state;

		return (
			<div className={styles.valueContainer} onClick={this.handleShowList}>
				{this.renderLabel(currentOption.label)}
				{this.renderCaret()}
			</div>
		);
	};

	render () {
		return this.renderSelect();
	}
}

export default MiniSelect;
