// @flow
import DropdownMenu from 'components/atoms/DropdownMenu';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import {Item as MenuItem} from 'rc-menu';
import KebabIconButton from 'components/molecules/Kebab/components/KebabIconButton';
import type {Option, Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

class KebabDropdownButton extends PureComponent<Props, State> {
	static defaultProps = {
		active: false,
		onClick: null,
		text: ''
	};

	state = {
		toggle: false
	};

	getItems = () => {
		const {options, value} = this.props;
		const result = [];

		if (options) {
			options.forEach(option => {
				const active = value === option.value;
				const className = active ? styles.selectedItem : '';
				const key = option.value.toString();

				result.push((
					<MenuItem className={className} key={key} onClick={this.handleMenuItemClick(option)}>
						{option.label}
						{active && <Icon className={styles.selectedItemIcon} name={ICON_NAMES.ACCEPT} />}
					</MenuItem>
				));
			});
		}

		return result;
	};

	handleMenuItemClick = (option: Option) => () => {
		const {onSelect} = this.props;

		this.setState({toggle: false});
		onSelect && onSelect(option);
	};

	handleToggleDropdownMenu = () => this.setState(({toggle}) => ({toggle: !toggle}));

	renderDropdownMenu = () => {
		const {toggle} = this.state;

		if (toggle) {
			return (
				<DropdownMenu onSelect={this.handleToggleDropdownMenu} onToggle={this.handleToggleDropdownMenu}>
					{this.getItems()}
				</DropdownMenu>
			);
		}

		return null;
	};

	renderIconButton = () => {
		const {active, icon, options, text} = this.props;
		let buttonTip = text;
		let handle = this.handleToggleDropdownMenu;

		if (options.length === 1) {
			const option = options[0];

			buttonTip = option.label;
			handle = this.handleMenuItemClick(option);
		}

		return (
			<KebabIconButton active={active} icon={icon} onClick={handle} round={false} text={buttonTip} />
		);
	};

	render () {
		return (
			<div className={styles.outerBox}>
				{this.renderIconButton()}
				{this.renderDropdownMenu()}
			</div>
		);
	}
}

export default KebabDropdownButton;
