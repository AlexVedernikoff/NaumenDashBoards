// @flow
import {Datepicker} from 'components/molecules';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import moment from 'moment';
import {OutsideClickDetector} from 'components/atoms';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class MaterialDateInput extends PureComponent<Props, State> {
	state = {
		showDatepicker: false
	};

	handleClickCalendarIcon = () => this.setState({showDatepicker: !this.state.showDatepicker});

	handleClickOutside = () => this.setState({showDatepicker: false});

	handleSelect = (date: string) => {
		const {name, onChange} = this.props;

		this.setState({showDatepicker: false});
		onChange(name, date);
	};

	renderCalendarIcon = () => <Icon className={styles.calendarIcon} name={ICON_NAMES.CALENDAR} onClick={this.handleClickCalendarIcon} />;

	renderDatepicker = () => {
		const {value} = this.props;
		const {showDatepicker} = this.state;

		if (showDatepicker) {
			return (
				<div className={styles.datepickerContainer}>
					<Datepicker onSelect={this.handleSelect} value={value} />
				</div>
			);
		}
	};

	renderValue = () => {
		const {value} = this.props;
		const date = value ? moment(value).format('DD.MM.YYYY') : '';

		return <div className={styles.valueContainer}>{date}</div>;
	};

	render () {
		return (
			<OutsideClickDetector onClickOutside={this.handleClickOutside}>
				<div className={styles.container}>
					{this.renderValue()}
					{this.renderCalendarIcon()}
					{this.renderDatepicker()}
				</div>
			</OutsideClickDetector>
		);
	}
}

export default MaterialDateInput;
