// @flow
import {AVAILABLE_DATE_FORMATS, SELECT_OPTIONS} from './constants';
import {COMPARE_PERIOD, DEFAULT_COMPARE_PERIOD} from 'store/widgets/data/constants';
import Datepicker from 'src/components/atoms/MaterialDateInput';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FormField from 'components/molecules/FormField';
import moment from 'utils/moment.config';
import type {OnChangeEvent, OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';
import t from 'localization';
import ToggableFormBox from 'components/molecules/ToggableFormBox';

export class ComparePeriodBox extends PureComponent<Props> {
	static defaultProps = {
		value: DEFAULT_COMPARE_PERIOD
	};

	format = 'DD.MM.YYYY';

	checkWidgetFilters = () => true;

	handleChange<T> (key: string, changeValue: T) {
		const {name, onChange, value} = this.props;

		onChange(name, {
			...value,
			[key]: changeValue
		});
	}

	handleDateChange = (name: string, value: string) => this.handleChange(name, value);

	handleDateSelect = (name: string, date: string) => this.handleChange(name, moment(date).format(this.format));

	handleSelect = ({name, value}: OnSelectEvent) => this.handleChange(name, value.value);

	handleToggle = ({name, value}: OnChangeEvent<boolean>) => this.handleChange(name, !value);

	renderCustomPeriodData = () => {
		const {value} = this.props;
		const {endDate = moment().format(this.format), period, startDate = moment().subtract(1, 'month').format(this.format)} = value;

		if (period === COMPARE_PERIOD.CUSTOM) {
			return (
				<Fragment>
					<FormField label={t('ComparePeriodBox::StartPeriod')} small>
						<Datepicker
							availableFormats={AVAILABLE_DATE_FORMATS}
							className={styles.datapicker}
							name={DIAGRAM_FIELDS.startDate}
							onChange={this.handleDateChange}
							onSelect={this.handleDateSelect}
							value={startDate}
						/>
					</FormField>
					<FormField label={t('ComparePeriodBox::EndPeriod')} small>
						<Datepicker
							availableFormats={AVAILABLE_DATE_FORMATS}
							className={styles.datapicker}
							name={DIAGRAM_FIELDS.endDate}
							onChange={this.handleDateChange}
							onSelect={this.handleDateSelect}
							value={endDate}
						/>
					</FormField>
				</Fragment>
			);
		}

		return null;
	};

	renderPeriodSelect = () => {
		const {value} = this.props;
		const {period} = value;
		const selectOption = SELECT_OPTIONS.find(({value}) => value === period);

		return (
			<FormField>
				<Select
					getOptionLabel={option => t(option.label)}
					name={DIAGRAM_FIELDS.period}
					onSelect={this.handleSelect}
					options={SELECT_OPTIONS}
					value={selectOption}
				/>
			</FormField>

		);
	};;

	render () {
		const {value} = this.props;
		const {allow, show} = value;

		if (allow) {
			return (
				<ToggableFormBox
					name={DIAGRAM_FIELDS.show}
					onToggle={this.handleToggle}
					showContent={show}
					title={t('ComparePeriodBox::CompareWithPeriod')}
				>
					{this.renderPeriodSelect()}
					{this.renderCustomPeriodData()}
				</ToggableFormBox>
			);
		}

		return null;
	}
}

export default ComparePeriodBox;
