// @flow
import AnimateHeight from 'react-animate-height';
import ChevronDown from 'icons/form/chevron-down-bare.svg';
import ChevronUp from 'icons/form/chevron-up-bare.svg';
import type {Node} from 'react';
import type {Props, State} from './types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';

export class DropDownMenu extends Component<Props, State> {
	state = {
		height: 0
	};

	toggleMenu = () => {
		const {height} = this.state;

		this.setState({
			height: height === 0 ? 'auto' : 0
		});
	};

	renderIcon = () => {
		const {height} = this.state;
		const icon = height ? <ChevronDown/> : <ChevronUp/>;

		return <div className={styles.icon}>{icon}</div>;
	};

	renderMenuItem = (item: Node): Node => <li>{item}</li>;

	renderMenuItems = (): Node => {
		const {children} = this.props;

		return (
			<ul className={styles.menu}>
				{children.map(this.renderMenuItem)}
			</ul>
		);
	};

	renderName = () => (
		<div onClick={this.toggleMenu} className={styles.name}>
			{this.props.name}
			{this.renderIcon()}
		</div>
	);

	renderMenu = () => {
		const {height} = this.state;

		return (
			<AnimateHeight duration={500} height={height}>
				{this.renderMenuItems()}
			</AnimateHeight>
		);
	};

	render () {
		return (
			<Fragment>
				{this.renderName()}
				{this.renderMenu()}
			</Fragment>
		);
	}
}

export default DropDownMenu;
