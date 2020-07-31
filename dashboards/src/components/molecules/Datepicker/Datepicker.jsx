// @flow
import cn from 'classnames';
import {DatepickerControl} from 'components/atoms';
import {LIMIT_DAYS, WEEK_LABELS, WEEKEND_DAYS} from './constants';
import moment from 'moment';
import type Moment from 'moment';
import type {Props as ControlProps} from 'components/atoms/DatepickerControl/types';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

moment.locale('ru');

export class Datepicker extends PureComponent<Props, State> {
	state = {
		currentDate: moment()
	};

	componentDidMount () {
		const {value} = this.props;
		const date = (moment(value));

		if (date.isValid()) {
			this.setState({currentDate: date});
		}
	}

	decreaseMonth = () => {
		const {currentDate} = this.state;
		this.setState({
			currentDate: moment(currentDate).subtract(1, 'months')
		});
	};

	decreaseYear = () => {
		const {currentDate} = this.state;
		this.setState({
			currentDate: moment(currentDate).subtract(1, 'years')
		});
	};

	getDays = (startDate: Moment) => {
		const days = [];

		for (let i = 0; i < LIMIT_DAYS; i++) {
			days.push(moment(startDate).add(i, 'days'));
		}

		return days;
	};

	handleClickDay = (e: SyntheticMouseEvent<HTMLDivElement>) => {
		const {onSelect} = this.props;
		const {value} = e.currentTarget.dataset;

		this.setState({currentDate: moment(value)});
		onSelect(value);
	};

	increaseMonth = () => {
		const {currentDate} = this.state;
		this.setState({
			currentDate: moment(currentDate).add(1, 'months')
		});
	};

	increaseYear = () => {
		const {currentDate} = this.state;
		this.setState({
			currentDate: moment(currentDate).add(1, 'years')
		});
	};

	renderControl = (props: ControlProps) => <DatepickerControl {...props} />;

	renderDay = (date: Moment) => {
		const {value} = this.props;
		const {currentDate} = this.state;
		const isToday = moment().isSame(date, 'day');
		const hasCurrentMonth = date.get('month') === currentDate.get('month');
		const isWeekend = WEEKEND_DAYS.includes(date.isoWeekday());
		const isSelected = value && moment(value).isSame(date, 'day') && hasCurrentMonth;

		const dayCN = cn({
			[styles.day]: true,
			[styles.todayDay]: hasCurrentMonth && isToday,
			[styles.anotherMonthDay]: !hasCurrentMonth,
			[styles.weekendDay]: isWeekend,
			[styles.currentWeekendDay]: hasCurrentMonth && isWeekend,
			[styles.selectedDay]: isSelected
		});

		return (
			<div className={dayCN} data-value={date.format()} onClick={this.handleClickDay}>
				{date.get('date')}
			</div>
		);
	};

	renderDays = () => {
		const {currentDate} = this.state;
		const startDate = moment(currentDate)
			.subtract(1, 'months')
			.endOf('month')
			.startOf('isoWeek');
		const days = this.getDays(startDate);

		return (
			<div className={styles.daysContainer}>
				{days.map(this.renderDay)}
			</div>
		);
	};

	renderDaysControl = () => {
		return (
			<div className={styles.daysControl}>
				{this.renderWeekLabels()}
				{this.renderDays()}
			</div>
		);
	};

	renderMonthControl = () => {
		const {currentDate} = this.state;

		return this.renderControl({
			onNextClick: this.increaseMonth,
			onPrevClick: this.decreaseMonth,
			transparent: true,
			value: currentDate.format('MMMM')
		});
	};

	renderWeekLabel = (label: string) => (
		<div className={styles.weekLabel}>
			{label}
		</div>
	);

	renderWeekLabels = () => (
		<div className={styles.weekLabelsContainer}>
			{WEEK_LABELS.map(this.renderWeekLabel)}
		</div>
	);

	renderYearControl = () => {
		const {currentDate} = this.state;

		return this.renderControl({
			onNextClick: this.increaseYear,
			onPrevClick: this.decreaseYear,
			transparent: false,
			value: currentDate.get('year')
		});
	};

	render () {
		return (
			<div className={styles.container}>
				{this.renderYearControl()}
				{this.renderMonthControl()}
				{this.renderDaysControl()}
			</div>
		);
	}
}

export default Datepicker;
