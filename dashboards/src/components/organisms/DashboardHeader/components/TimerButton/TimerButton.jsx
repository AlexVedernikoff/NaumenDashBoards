// @flow
import type {DivRef} from 'components/types';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import styles from './styles.less';

export class TimerButton extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		duration: 15,
		tip: ''
	};

	interval = null;
	ref: DivRef = createRef();

	componentDidMount () {
		this.interval = this.startTime(this.props.duration, this.ref);
	}

	componentDidUpdate (prevProps: Props) {
		if (this.props.duration !== prevProps.duration) {
			clearInterval(this.interval);
			this.interval = this.startTime(this.props.duration, this.ref);
		}
	}

	startTime = (duration: number, divRef: DivRef) => {
		const formateTime = 60 * duration;
		let timer = formateTime;
		let minutes;
		let seconds;

		return setInterval(() => {
			minutes = parseInt(timer / 60, 10);
			seconds = parseInt(timer % 60, 10);

			minutes = minutes < 10 ? '0' + minutes : minutes;
			seconds = seconds < 10 ? '0' + seconds : seconds;

			if (divRef.current) {
				divRef.current.textContent = minutes + ':' + seconds;
			}

			if (--timer < 0) {
					timer = formateTime;
			}
		}, 1000);
	};

	render () {
		const {onClick, tip} = this.props;

		return (
			<button className={styles.button} onClick={onClick} title={tip}>
				<div className={styles.timerTime} ref={this.ref} />
				<Icon name={ICON_NAMES.TIMER} />
			</button>
		);
	}
}

export default TimerButton;
