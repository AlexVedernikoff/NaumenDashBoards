// @flow
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class CreationPanel extends PureComponent<Props> {
	static defaultProps = {
		className: ''
	};

	render () {
		const {className, onClick, text} = this.props;
		const containerCN = cn(styles.container, className);

		return (
			<div className={containerCN}>
				<div className={styles.button} onClick={onClick}>
					<Icon name={ICON_NAMES.PLUS} />
					<div className={styles.text}>{text}</div>
				</div>
			</div>
		);
	}
}

export default CreationPanel;
