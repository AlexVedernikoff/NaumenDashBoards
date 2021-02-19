// @flow
import AbsolutePortal from 'components/molecules/AbsolutePortal';
import type {DivRef} from 'components/types';
import IconButton from 'components/atoms/IconButton';
import {List} from 'components/molecules/Select/components';
import OutsideClickDetector from 'components/atoms/OutsideClickDetector';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import styles from './styles.less';

export class DropDownButton extends PureComponent<Props, State> {
	static defaultProps = {
		className: '',
		round: false
	};

	state = {
		showMenu: false
	};

	ref: DivRef = createRef();

	handleClickButton = () => this.setState({showMenu: !this.state.showMenu});

	handleClickItem = (value: string) => {
		const {onSelect} = this.props;

		this.hideMenu();
		onSelect(value);
	};

	hideMenu = () => this.setState({showMenu: false});

	renderButton = () => {
		const {buttonIcon, className, round} = this.props;
		const {showMenu} = this.state;
		let {tip} = this.props;

		if (showMenu) {
			tip = '';
		}

		return (
			<IconButton className={className} icon={buttonIcon} onClick={this.handleClickButton} round={round} tip={tip} />
		);
	};

	renderMenu = () => {
		const {menu, value} = this.props;
		const {showMenu} = this.state;

		if (showMenu) {
			return (
				<AbsolutePortal elementRef={this.ref} onClickOutside={this.hideMenu}>
					<div className={styles.menu}>
						<List onSelect={this.handleClickItem} options={menu} showSelectedIcon={true} value={value} />
					</div>
				</AbsolutePortal>
			);
		}

		return null;
	};

	render () {
		return (
			<OutsideClickDetector onClickOutside={this.hideMenu}>
				<div className={styles.container} ref={this.ref}>
					{this.renderButton()}
					{this.renderMenu()}
				</div>
			</OutsideClickDetector>
		);
	}
}

export default DropDownButton;
