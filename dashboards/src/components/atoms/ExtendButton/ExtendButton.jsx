// @flow
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class ExtendButton extends PureComponent<Props> {
	static defaultProps = {
		className: ''
	};

	render () {
		const {active, className, onClick, text} = this.props;
		const containerCN = cn({
			[styles.container]: true,
			[styles.activeContainer]: active,
			[className]: true
		});

		return (
			<div className={containerCN} onClick={onClick}>
				<Icon name={ICON_NAMES.PLUS} />
				<div className={styles.text}>{text}</div>
			</div>
		);
	}
}

export default ExtendButton;
