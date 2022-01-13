// @flow
import Container from 'components/atoms/Container';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import t from 'localization';
import {TIMER_VALUE} from 'store/sources/attributes//constants';

export class TimerValueListOptionValue extends PureComponent<Props> {
	getTimerValueLabel = () => {
		const {attribute} = this.props;

		switch (attribute.timerValue) {
			case TIMER_VALUE.STATUS:
				return t('TimerValueListOptionValue::Status');
			case TIMER_VALUE.VALUE:
				return t('TimerValueListOptionValue::Value');
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
