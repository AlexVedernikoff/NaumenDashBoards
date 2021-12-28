// @flow
import AbsolutePortal from 'components/molecules/AbsolutePortal';
import type {DivRef} from 'components/types';
import {FORCE_TO_SHOW_CONTEXT} from 'components/molecules/Kebab/constants';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import KebabIconButton from 'components/molecules/Kebab/components/KebabIconButton';
import Menu, {Item as MenuItem} from 'rc-menu';
import type {Option, Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'react';
import styles from './styles.less';

class KebabDropdownButton extends PureComponent<Props, State> {
	ref: DivRef = createRef();
	menuRef: Ref<typeof Menu> = createRef();
	forceShow: ((force: boolean) => void) | null;

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

		onSelect && onSelect(option);
	};

	handleToggleDropdownMenu = () => {
		this.setState(({toggle}) => ({toggle: !toggle}), () => this.forceShow?.(this.state.toggle));
	};

	renderDropdownMenu = () => {
		const {toggle} = this.state;

		if (toggle) {
			return (
				<AbsolutePortal elementRef={this.ref} onClickOutside={this.handleToggleDropdownMenu}>
					<Menu className={styles.dropdownMenu} onSelect={this.handleToggleDropdownMenu} ref={this.menuRef}>
						{this.getItems()}
					</Menu>
				</AbsolutePortal>
			);
		}

		return null;
	};

	renderElement = () => (
		<div className={styles.outerBox} ref={this.ref}>
			{this.renderIconButton()}
			{this.renderDropdownMenu()}
		</div>
	);

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
			<FORCE_TO_SHOW_CONTEXT.Consumer>
				{
					forceShow => {
						this.forceShow = forceShow;
						return this.renderElement();
					}
				}
			</FORCE_TO_SHOW_CONTEXT.Consumer>
		);
	}
}

export default KebabDropdownButton;
