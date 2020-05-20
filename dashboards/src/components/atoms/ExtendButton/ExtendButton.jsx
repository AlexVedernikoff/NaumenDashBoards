// @flow
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class ExtendButton extends PureComponent<Props> {
	getIconClassName = () => this.props.active ? cn([styles.icon, styles.activeIcon]) : styles.icon;

	getTextClassName = () => this.props.active ? cn([styles.text, styles.activeText]) : styles.text;

	render () {
		const {onClick, text} = this.props;

		return (
			<div className={styles.container} onClick={onClick}>
				<Icon className={this.getIconClassName()} name={ICON_NAMES.PLUS} />
				<div className={this.getTextClassName()}>{text}</div>
			</div>
		);
	}
}

export default ExtendButton;
