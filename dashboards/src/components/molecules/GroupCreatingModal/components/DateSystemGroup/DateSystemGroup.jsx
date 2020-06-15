// @flow
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {
	DATETIME_DAY_FORMATS,
	DAY_FORMATS,
	HOURS_FORMATS,
	MONTH_FORMATS,
	QUARTER_FORMATS,
	WEEK_FORMATS
} from './constants';
import {DATETIME_SYSTEM_GROUP} from 'store/widgets/constants';
import {FormControl, Select} from 'components/molecules/index';
import type {Group} from 'store/widgets/data/types';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import {SystemGroup} from 'components/molecules/GroupCreatingModal/components';

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
		const {DAY, HOURS, MONTH, QUARTER, WEEK} = DATETIME_SYSTEM_GROUP;

		switch (group) {
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
			default:
				return [];
		}
	};

	groupUsesFormatting = () => {
		const {group} = this.state;
		const {DAY, HOURS, MONTH, QUARTER, WEEK} = DATETIME_SYSTEM_GROUP;

		return [DAY, HOURS, MONTH, QUARTER, WEEK].includes(group);
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

		this.groupUsesFormatting() ? onSubmit({...group, format}) : onSubmit(group);
	};

	renderFormat = () => {
		const {className, show} = this.props;
		const {format, options} = this.state;

		if (show && this.groupUsesFormatting()) {
			const value = options.find(o => o.value === format) || null;

			return (
				<FormControl className={className} label="Выберете значение">
					<Select onSelect={this.handleSelectFormat} options={options} value={value} />
				</FormControl>
			);
		}
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
