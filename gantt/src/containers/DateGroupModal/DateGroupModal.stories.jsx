import {action} from '@storybook/addon-actions';
import {ATTRIBUTE_TYPES} from 'src/store/sources/attributes/constants';
import DateGroupModal from './DateGroupModal';
import {DATETIME_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
import React from 'react';

export default {
	component: DateGroupModal,
	title: 'Containers/DateGroupModal'
};

const Template = (args) => <DateGroupModal {...args} onClose={action('onClose')} onSubmit={action('onSubmit')} />;

export const Date = Template.bind({});

Date.args = {
	attribute: {
		title: 'Дата',
		type: ATTRIBUTE_TYPES.date
	},
	value: {
		data: DATETIME_SYSTEM_GROUP.MONTH,
		way: GROUP_WAYS.SYSTEM
	}
};

export const DateTime = Template.bind({});

DateTime.args = {
	...Date.args,
	attribute: {
		title: 'Дата со временем',
		type: ATTRIBUTE_TYPES.dateTime
	}
};
