// @flow
import cn from 'classnames';
import type {DivRef} from 'src/components/types';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import styles from './styles.less';

export class Item extends PureComponent<Props> {
	itemRef: DivRef = createRef();

	componentDidMount () {
		this.focus();
	}

	componentDidUpdate (prevProps: Props) {
		const {focused} = this.props;

		if (focused && focused !== prevProps.focused) {
			this.focus();
		}
	}

	focus = () => {
		const {focused, onFocus} = this.props;
		const {current: item} = this.itemRef;

		focused && item && onFocus(item);
	};

	render () {
		const {children, className, focused, onFocus, selected, ...props} = this.props;
		const CN = cn({
			[styles.selectedItem]: selected,
			[styles.focusedItem]: focused
		}, styles.item, className);

		return (
			<div {...props} className={CN} ref={this.itemRef}>
				{children}
			</div>
		);
	}
}

export default Item;
