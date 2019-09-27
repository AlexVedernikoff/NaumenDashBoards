// @flow
import classnames from 'classnames';
import type {Node} from 'react';
import Plus from 'icons/form/plus.svg';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

export class TextWithIcon extends Component<Props> {
	static defaultProps: {
		className: '',
		value: ''
	};

	renderIcon = (): Node => {
		const {handleClick} = this.props;

		return (
			<div className={styles.icon}>
				<Plus onClick={handleClick}/>
			</div>
		);
	};

	renderTextWithIcon = (): Node => {
		const {className, name} = this.props;
		const classProps: string = classnames(
			className,
			styles.textWithIcon
		);

		return (
			<div className={classProps}>
				<p className={styles.name}>{name}</p>
				{this.renderIcon()}
			</div>
		);
	};

	render () {
		return this.renderTextWithIcon();
	}
}

export default TextWithIcon;
