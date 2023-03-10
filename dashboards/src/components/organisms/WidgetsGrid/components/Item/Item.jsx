// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Item extends PureComponent<Props> {
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
		const {current: item} = this.props.forwardedRef;

		focused && item && onFocus(item);
	};

	render () {
		const {children, className, focused, forwardedRef, onFocus, selected, ...props} = this.props;
		const CN = cn({
			[styles.focusedItem]: focused && !selected,
			[styles.selectedItem]: selected
		}, styles.item, className);

		return (
			<div {...props} className={CN} ref={this.props.forwardedRef}>
				{children}
			</div>
		);
	}
}

export default React.forwardRef((props, ref) => <Item {...props} forwardedRef={ref} />);
