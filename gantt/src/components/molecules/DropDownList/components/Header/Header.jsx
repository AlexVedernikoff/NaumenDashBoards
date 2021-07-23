// @flow
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import Text, {TEXT_TYPES} from 'components/atoms/Text';

export class Header extends PureComponent<Props> {
	renderCaret = () => {
		const {onClickCaret, showList} = this.props;
		const {CARET_DOWN, CARET_UP} = ICON_NAMES;
		const name = showList ? CARET_UP : CARET_DOWN;

		return <IconButton icon={name} onClick={onClickCaret} round={false} />;
	};

	render () {
		const {className, onClick, title} = this.props;

		return (
			<div className={className}>
				<Text className={styles.text} onClick={onClick} type={TEXT_TYPES.SMALL}>{title}</Text>
				{this.renderCaret()}
			</div>
		);
	}
}

export default Header;
