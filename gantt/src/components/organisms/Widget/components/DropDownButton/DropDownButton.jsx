// @flow
import AbsolutePortal from 'components/molecules/AbsolutePortal';
import type {DivRef} from 'components/types';
import IconButton from 'components/atoms/IconButton';
import List from 'components/molecules/Select/components/List';
import type {MenuItem, Props, State} from './types';
import OutsideClickDetector from 'components/atoms/OutsideClickDetector';
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

	containerRef: DivRef = createRef();

	handleClickButton = () => this.setState({showMenu: !this.state.showMenu});

	handleClickItem = (value: MenuItem) => {
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
				<AbsolutePortal elementRef={this.containerRef} onClickOutside={this.hideMenu}>
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
				<div className={styles.container} ref={this.containerRef}>
					{this.renderButton()}
					{this.renderMenu()}
				</div>
			</OutsideClickDetector>
		);
	}
}

export default DropDownButton;
