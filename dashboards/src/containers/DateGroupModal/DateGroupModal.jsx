// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import BetweenOrCondition from 'GroupModal/components/BetweenOrCondition';
import {connect} from 'react-redux';
import {DATETIME_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
import {DATETIME_SYSTEM_OPTIONS, FORMATS, OR_CONDITION_OPTIONS, SCHEMA, SYSTEM_OPTIONS} from './constants';
import defaultComponents from 'GroupModal/defaultComponents';
import type {Group} from 'store/widgets/data/types';
import GroupModal from 'containers/GroupModal';
import memoize from 'memoize-one';
import type {OrConditionProps} from 'components/organisms/GroupModal/types';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';
import {props} from './selectors';
import type {Props as SystemGroupProps} from 'GroupModal/components/SystemGroup/types';
import type {Props, State} from './types';
import React, {Component, createContext, Fragment} from 'react';
import SimpleOrCondition from 'GroupModal/components/SimpleOrCondition';
import SystemDateGroupFormat from 'GroupModal/components/SystemDateGroupFormat';

const FORMAT_CONTEXT = createContext('');

FORMAT_CONTEXT.displayName = 'FORMAT_CONTEXT';

export class DateGroupModal extends Component<Props, State> {
	state = {
		format: ''
	};

	getComponents = memoize(() => ({
		...defaultComponents,
		OrCondition: this.renderOrCondition,
		SystemGroup: this.renderSystemGroup
	}));

	componentDidMount () {
		const {format} = this.props.value;
		return format && this.setState({format});
	}

	getSystemOptions = () => {
		return this.props.attribute.type === ATTRIBUTE_TYPES.dateTime ? DATETIME_SYSTEM_OPTIONS : SYSTEM_OPTIONS;
	};

	getFormatOptions (group: string) {
		const {attribute} = this.props;
		const {DAY, HOURS, MINUTES, MONTH, QUARTER, SEVEN_DAYS, WEEK, YEAR} = DATETIME_SYSTEM_GROUP;

		switch (group) {
			case MINUTES:
				return FORMATS.MINUTES;
			case HOURS:
				return FORMATS.HOURS;
			case DAY:
				return attribute.type === ATTRIBUTE_TYPES.dateTime ? FORMATS.DATETIME_DAY : FORMATS.DAY;
			case WEEK:
				return FORMATS.WEEK;
			case MONTH:
				return FORMATS.MONTH;
			case QUARTER:
				return FORMATS.QUARTER;
			case SEVEN_DAYS:
				return FORMATS.SEVEN_DAYS;
			case YEAR:
				return FORMATS.YEAR;
		}
	}

	handleChangeFormat = (format: string) => this.setState({format});

	handleSubmit = (group: Group, attribute: Attribute) => {
		const {onSubmit} = this.props;
		const {format} = this.state;
		let newGroup = group;

		if (group.way === GROUP_WAYS.SYSTEM) {
			newGroup = {...newGroup, format};
		}

		onSubmit(newGroup, attribute);
	};

	renderOrCondition = (props: OrConditionProps) => {
		const {onChange, value} = props;
		const {BETWEEN, LAST, LAST_HOURS, NEAR, NEAR_HOURS} = OR_CONDITION_TYPES;
		const {data, type} = value;

		switch (type) {
			case BETWEEN:
				return <BetweenOrCondition data={data} onChange={onChange} type={type} />;
			case LAST:
			case NEAR:
			case LAST_HOURS:
			case NEAR_HOURS:
				return <SimpleOrCondition onChange={onChange} onlyNumber={true} value={value} />;
			default:
				return null;
		}
	};

	renderSystemGroup = (props: $Shape<SystemGroupProps>) => {
		const {SystemGroup} = defaultComponents;

		return (
			<Fragment>
				<SystemGroup {...props} />
				<FORMAT_CONTEXT.Consumer>
					{(format) => this.renderSystemGroupFormat(props.value, format)}
				</FORMAT_CONTEXT.Consumer>
			</Fragment>
		);
	};

	renderSystemGroupFormat = (group: string, format: string) => (
		<SystemDateGroupFormat
			onChange={this.handleChangeFormat}
			options={this.getFormatOptions(group)}
			value={format}
		/>
	);

	render () {
		const {attribute, customGroups, onClose, value} = this.props;
		const {format} = this.state;

		return (
			<FORMAT_CONTEXT.Provider value={format}>
				<GroupModal
					attribute={attribute}
					components={this.getComponents()}
					customGroups={customGroups}
					customType={attribute.type}
					onClose={onClose}
					onSubmit={this.handleSubmit}
					orConditionOptions={OR_CONDITION_OPTIONS}
					schema={SCHEMA}
					systemOptions={this.getSystemOptions()}
					value={value}
				/>
			</FORMAT_CONTEXT.Provider>
		);
	}
}

export default connect(props)(DateGroupModal);
