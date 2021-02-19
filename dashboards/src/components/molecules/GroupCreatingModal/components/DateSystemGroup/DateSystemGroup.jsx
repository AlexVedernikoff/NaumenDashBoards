// @flow
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {
	DATETIME_DAY_FORMATS,
	DAY_FORMATS,
	HOURS_FORMATS,
	MINUTES_FORMATS,
	MONTH_FORMATS,
	QUARTER_FORMATS,
	SEVEN_DAYS_FORMATS,
	WEEK_FORMATS,
	YEAR_FORMATS
} from './constants';
import {DATETIME_SYSTEM_GROUP} from 'store/widgets/constants';
import FormField from 'components/molecules/GroupCreatingModal/components/FormField';
import type {Group} from 'store/widgets/data/types';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import Select from 'components/molecules/Select';
import SystemGroup from 'components/molecules/GroupCreatingModal/components/SystemGroup';

export class DateSystemGroup extends PureComponent<Props, State> {
	state = {
		format: '',
		group: '',
		options: []
	};

	componentDidMount () {
		const {format} = this.props.group;
		format && this.setState({format});
	}

	getFormatOptions = (group: string) => {
		const {attribute} = this.props;
		const {type} = attribute;
		const {DAY, HOURS, MINUTES, MONTH, QUARTER, SEVEN_DAYS, WEEK, YEAR} = DATETIME_SYSTEM_GROUP;

		switch (group) {
			case MINUTES:
				return MINUTES_FORMATS;
			case HOURS:
				return HOURS_FORMATS;
			case DAY:
				return type === ATTRIBUTE_TYPES.dateTime ? DATETIME_DAY_FORMATS : DAY_FORMATS;
			case WEEK:
				return WEEK_FORMATS;
			case MONTH:
				return MONTH_FORMATS;
			case QUARTER:
				return QUARTER_FORMATS;
			case SEVEN_DAYS:
				return SEVEN_DAYS_FORMATS;
			case YEAR:
				return YEAR_FORMATS;
			default:
				return [];
		}
	};

	handleSelectFormat = ({value}: Object) => {
		const {value: format} = value;
		this.setState({format});
	};

	handleSelectGroup = (group: string) => {
		const options = this.getFormatOptions(group);
		let format = '';

		if (options.length > 0) {
			format = options[0].value;
		}

		this.setState({format, group, options});
	};

	handleSubmit = (group: Group) => {
		const {onSubmit} = this.props;
		const {format} = this.state;

		onSubmit({...group, format});
	};

	renderFormat = () => {
		const {className} = this.props;
		const {format, options} = this.state;
		const value = options.find(o => o.value === format) || null;
		const disabled = options.length === 1;

		return (
			<FormField className={className} label="Выберите значение">
				<Select disabled={disabled} onSelect={this.handleSelectFormat} options={options} value={value} />
			</FormField>
		);
	};

	renderGroup = () => {
		const {onSubmit, ...props} = this.props;

		return (
			<SystemGroup
				{...props}
				onSelect={this.handleSelectGroup}
				onSubmit={this.handleSubmit}
			/>
		);
	};

	render () {
		return (
			<Fragment>
				{this.renderGroup()}
				{this.renderFormat()}
			</Fragment>
		);
	}
}

export default DateSystemGroup;
