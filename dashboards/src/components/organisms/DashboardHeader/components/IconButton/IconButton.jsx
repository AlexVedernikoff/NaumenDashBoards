// @flow
import cn from 'classnames';
import {Icon} from 'components/atoms';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {VARIANTS} from './constants';

export class IconButton extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		outline: false,
		tip: '',
		variant: VARIANTS.ADDITIONAL
	};

	getClassNames = () => {
		const {className, outline, variant} = this.props;
		const {ADDITIONAL, GREEN} = VARIANTS;

		return cn({
			[styles.button]: true,
			[styles.green]: variant && !outline === GREEN,
			[styles.outlineGreen]: variant === GREEN && outline,
			[styles.additional]: variant === ADDITIONAL
		}, className);
	};

	render () {
		const {name, onClick, tip} = this.props;
		const className = this.getClassNames();

		return (
			<button className={className} onClick={onClick} title={tip}>
				<Icon name={name} />
			</button>
		);
	}
}

export default IconButton;
