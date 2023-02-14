// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class Container extends PureComponent<Props> {
	render () {
		const {children, className, forwardedRef, onClick, style, title} = this.props;

		return (
			<div className={className} onClick={onClick} ref={forwardedRef} style={style} title={title}>
				{children}
			</div>
		);
	}
}

export default React.forwardRef((props, ref) => <Container {...props} forwardedRef={ref} />);
