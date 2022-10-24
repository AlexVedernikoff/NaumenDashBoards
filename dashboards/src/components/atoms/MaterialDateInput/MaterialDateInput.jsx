// @flow
import cn from 'classnames';
import Datepicker from 'components/molecules/Datepicker';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import moment from 'utils/moment.config';
import OutsideClickDetector from 'components/atoms/OutsideClickDetector';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class MaterialDateInput extends PureComponent<Props, State> {
	static defaultProps = {
		className: ''
	};

	state = {
		showDatepicker: false
	};

	handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {name, onChange} = this.props;

		onChange(name, e.currentTarget.value);
	};

	handleClickCalendarIcon = () => this.setState({showDatepicker: !this.state.showDatepicker});

	handleClickOutside = () => this.setState({showDatepicker: false});

	handleSelect = (date: string) => {
		const {name, onSelect} = this.props;

		this.setState({showDatepicker: false});
		onSelect(name, date);
	};

	renderCalendarIcon = () => <Icon className={styles.calendarIcon} name={ICON_NAMES.CALENDAR} onClick={this.handleClickCalendarIcon} />;

	renderDatepicker = () => {
		const {availableFormats, value: currValue} = this.props;
		const {showDatepicker} = this.state;

		const value = moment(currValue, availableFormats, true).isValid() ? moment(currValue, availableFormats) : moment();

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

		return (
			<div className={styles.valueContainer}>
				<input onChange={this.handleChange} value={value} />
			</div>
		);
	};

	render () {
		const className = cn(styles.container, this.props.className);
		return (
			<OutsideClickDetector onClickOutside={this.handleClickOutside}>
				<div className={className}>
					{this.renderValue()}
					{this.renderCalendarIcon()}
					{this.renderDatepicker()}
				</div>
			</OutsideClickDetector>
		);
	}
}

export default MaterialDateInput;
