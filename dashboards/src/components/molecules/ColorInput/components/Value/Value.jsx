// @flow
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Value extends PureComponent<Props> {
	renderButton = () => (
		<button className={styles.button}>
			<Icon name={ICON_NAMES.CARET} />
		</button>
	);

	renderValue = () => {
		const {value: backgroundColor} = this.props;

		return <span className={styles.value} style={{backgroundColor}} />;
	};

	render () {
		const {forwardedRef, onClick} = this.props;

		return (
			<div className={styles.container} onClick={onClick} ref={forwardedRef}>
				{this.renderValue()}
				{this.renderButton()}
			</div>
		);
	}
}

export default Value;
