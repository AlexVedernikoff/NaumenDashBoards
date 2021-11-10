// @flow
import Container from 'components/atoms/Container';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {TIMER_VALUE} from 'store/sources/attributes//constants';

export class TimerValueListOptionValue extends PureComponent<Props> {
	getTimerValueLabel = () => {
		const {attribute} = this.props;

		switch (attribute.timerValue) {
			case TIMER_VALUE.STATUS:
				return 'Статус';
			case TIMER_VALUE.VALUE:
				return 'Значение';
			default:
				return '';
		}
	};

	renderTimerValue = () => (
		<span className={styles.timerValue}>
			{this.getTimerValueLabel()},&nbsp;
		</span>
	);

	renderValue = () => {
		const {attribute: {title}} = this.props;
		return (
			<span className={styles.value}>
				{title}
			</span>
		);
	};

	render () {
		const {className} = this.props;
		return (
			<Container className={className}>
				{this.renderTimerValue()}
				{this.renderValue()}
			</Container>
		);
	}
}

export default TimerValueListOptionValue;
