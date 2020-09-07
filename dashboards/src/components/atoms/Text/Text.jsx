// @flow
import cn from 'classnames';
import {ELEMENT_TYPES, TEXT_TYPES} from './constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Text extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		elementType: ELEMENT_TYPES.DIV,
		type: TEXT_TYPES.REGULAR
	};

	getClassName = () => {
		const {className, type} = this.props;
		const {REGULAR, SMALL, TITLE} = TEXT_TYPES;

		return cn({
			[styles.regular]: type === REGULAR,
			[styles.small]: type === SMALL,
			[styles.title]: type === TITLE,
			[className]: true
		});
	};

	render () {
		const {children, elementType, ...rest} = this.props;
		const props = {
			...rest,
			children,
			className: this.getClassName()
		};

		return elementType === ELEMENT_TYPES.DIV ? <div {...props} /> : <span {...props} />;
	}
}

export default Text;
