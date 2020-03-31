// @flow
import {ChevronDownIcon} from 'icons/form';
import type {Option, Props, State} from './types';
import {OutsideClickDetector} from 'components/atoms';
import React, {PureComponent} from 'react';
import {SimpleSelectList} from 'components/molecules';
import styles from './styles.less';

export class SimpleSelect extends PureComponent<Props, State> {
	static defaultProps = {
		defaultValue: {
			label: 'Выберите значение',
			value: ''
		},
		value: null
	};

	state = {
		showMenu: false
	};

	handleClickLabel = () => this.setState({showMenu: !this.state.showMenu});

	handleSelect = (value: Option) => {
		const {name, onSelect} = this.props;

		this.setState({showMenu: false});
		onSelect(name, value);
	};

	hideMenu = () => this.setState({showMenu: false});

	renderLabel = () => {
		const {defaultValue, value} = this.props;
		const label = value ? value.label : defaultValue.label;

		return (
			<div className={styles.label} onClick={this.handleClickLabel}>
				<div>{label}</div>
				<ChevronDownIcon />
			</div>
		);
	};

	renderMenu = () => {
		const {defaultValue, options, value} = this.props;
		const {showMenu} = this.state;

		if (showMenu) {
			return (
				<div className={styles.menu}>
					<SimpleSelectList
						onClose={this.hideMenu}
						onSelect={this.handleSelect}
						options={options}
						value={value || defaultValue}
					/>
				</div>
			);
		}
	};

	render () {
		return (
			<OutsideClickDetector onClickOutside={this.hideMenu}>
				<div className={styles.container}>
					{this.renderLabel()}
					{this.renderMenu()}
				</div>
			</OutsideClickDetector>
		);
	}
}

export default SimpleSelect;
