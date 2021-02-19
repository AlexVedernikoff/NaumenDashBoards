// @flow
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Caret extends PureComponent<Props> {
	static defaultProps = {
		iconName: ICON_NAMES.CARET,
		round: true
	};

	render (): React$Node {
		const {iconName, onClick, round} = this.props;

		return <IconButton className={styles.caret} icon={iconName} onClick={onClick} round={round} />;
	}
}

export default Caret;
