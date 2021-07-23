import {action} from '@storybook/addon-actions';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {GROUP_WAYS} from 'store/widgets/constants';
import React from 'react';
import TimerGroupModal from './TimerGroupModal';

export default {
	component: TimerGroupModal,
	title: 'Containers/TimerGroupModal'
};

const Template = args => <TimerGroupModal {...args} onClose={action('onClose')} onSubmit={action('onSubmit')} />;

export const Timer = Template.bind({});

Timer.args = {
	attribute: {
		title: 'Счетчик',
		type: ATTRIBUTE_TYPES.timer
	},
	value: {
		data: '',
		way: GROUP_WAYS.SYSTEM
	}
};

export const BackTimer = Template.bind({});

BackTimer.args = {
	attribute: {
		title: 'Обратный Счетчик',
		type: ATTRIBUTE_TYPES.backTimer
	},
	value: {
		data: '',
		way: GROUP_WAYS.SYSTEM
	}
};
