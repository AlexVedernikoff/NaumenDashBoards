import {action} from '@storybook/addon-actions';
import {ATTRIBUTE_TYPES, TIMER_VALUE} from 'store/sources/attributes/constants';
import {GROUP_WAYS} from 'store/widgets/constants';
import React from 'react';
import TimerValueGroupModal from './TimerValueGroupModal';

export default {
	component: TimerValueGroupModal,
	title: 'Containers/TimerValueGroupModal'
};

const Template = args => <TimerValueGroupModal {...args} onClose={action('onClose')} onSubmit={action('onSubmit')} />;

export const TimerValue = Template.bind({});

TimerValue.args = {
	attribute: {
		timerValue: TIMER_VALUE.VALUE,
		title: 'Счетчик по значению',
		type: ATTRIBUTE_TYPES.timer
	},
	value: {
		data: '',
		way: GROUP_WAYS.SYSTEM
	}
};
