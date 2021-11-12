// @flow
import cn from 'classnames';
import IconButton from 'components/atoms/IconButton';
import type {Props} from './types';
import React, { PureComponent} from 'react';
import styles from './styles.less';

class KebabIconButton extends PureComponent<Props> {
	static defaultProps = {
		active: false,
		onClick: null,
		text: ''
	};

	render () {
		const {active, icon, onClick, text} = this.props;
		const className = cn(styles.kebabIconButton, {
			[styles.activeKebabItem]: active
		});

		return (
			<IconButton className={className} icon={icon} onClick={onClick} round={false} tip={text} />
		);
	}
}

export default KebabIconButton;
