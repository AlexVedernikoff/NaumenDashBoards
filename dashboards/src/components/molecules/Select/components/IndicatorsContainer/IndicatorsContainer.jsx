// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class IndicatorsContainer extends PureComponent<Props> {
	static defaultProps = {
		className: ''
	};

	render (): React$Node {
		const {children, className} = this.props;

		return (
			<div className={cn(styles.container, className)}>
				{children}
			</div>
		);
	}
}

export default IndicatorsContainer;
