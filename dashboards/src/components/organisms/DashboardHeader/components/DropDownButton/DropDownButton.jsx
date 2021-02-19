// @flow
import {IconButton} from 'components/organisms/DashboardHeader/components';
import MenuItem from './components/MenuItem';
import type {MenuItem as MenuItemType, Props, State} from './types';
import OutsideClickDetector from 'components/atoms/OutsideClickDetector';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class DropDownButton extends PureComponent<Props, State> {
	state = {
		showMenu: false
	};

	handleClickButton = () => this.setState({showMenu: !this.state.showMenu});

	handleClickItem = (value: string) => {
		const {onSelect} = this.props;

		this.hideMenu();
		onSelect(value);
	};

	hideMenu = () => this.setState({showMenu: false});

	renderButton = () => {
		const {name} = this.props;
		const {showMenu} = this.state;
		let {tip} = this.props;

		if (showMenu) {
			tip = '';
		}

		return (
			<IconButton name={name} onClick={this.handleClickButton} tip={tip} />
		);
	};

	renderMenu = () => {
		const {menu} = this.props;
		const {showMenu} = this.state;

		if (showMenu) {
			return (
				<div className={styles.menu}>
					{menu.map(this.renderMenuItem)}
				</div>
			);
		}
	};

	renderMenuItem = (item: MenuItemType) => {
		const {label, value} = item;

		return (
			<MenuItem key={value} label={label} onClick={this.handleClickItem} value={value} />
		);
	};

	render () {
		return (
			<OutsideClickDetector onClickOutside={this.hideMenu}>
				<div className={styles.container}>
					{this.renderButton()}
					{this.renderMenu()}
				</div>
			</OutsideClickDetector>
		);
	}
}

export default DropDownButton;
