// @flow
import Icon from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Option extends PureComponent<Props> {
	handleClick = () => {
		const {onClick, value} = this.props;
		onClick(value);
	};

	render () {
		const {icon} = this.props;

		return (
			<div className={styles.option}>
				<Icon name={icon} onClick={this.handleClick} />
			</div>
		);
	}
}

export default Option;
