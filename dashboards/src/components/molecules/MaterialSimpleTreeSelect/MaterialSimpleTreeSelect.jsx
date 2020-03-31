// @flow
import type {Option, Props, State} from './types';
import {OutsideClickDetector} from 'components/atoms';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {Tree} from './components';
import {ValueContainer} from 'components/molecules/MaterialSelect/components';

export class MaterialSelect extends PureComponent<Props, State> {
	static defaultProps = {
		name: '',
		placeholder: 'Выберите значение',
		value: null
	};

	state = {
		showTree: false
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

	handleClickValue = () => this.setState({showTree: !this.state.showTree});

	handleSelect = (value: Option) => {
		const {name, onSelect} = this.props;

		this.setState({showTree: false});
		onSelect(name, value);
	};

	hideMenu = () => this.setState({showTree: false});

	renderTree = () => {
		const {options, value} = this.props;
		const {showTree} = this.state;

		if (showTree) {
			return (
				<Tree
					className={styles.tree}
					getOptionLabel={this.getOptionLabel}
					getOptionValue={this.getOptionValue}
					onSelect={this.handleSelect}
					options={options}
					value={value}
				/>
			);
		}
	};

	renderValueContainer = () => {
		const {placeholder, value} = this.props;

		return (
			<ValueContainer
				getOptionLabel={this.getOptionLabel}
				getOptionValue={this.getOptionValue}
				label={this.getOptionLabel(value)}
				onClick={this.handleClickValue}
				placeholder={placeholder}
				value={value}
			/>
		);
	};

	render () {
		return (
			<OutsideClickDetector onClickOutside={this.hideMenu}>
				<div className={styles.container}>
					{this.renderValueContainer()}
					{this.renderTree()}
				</div>
			</OutsideClickDetector>
		);
	}
}

export default MaterialSelect;
