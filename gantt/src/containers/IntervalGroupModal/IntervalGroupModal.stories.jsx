import {action} from '@storybook/addon-actions';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {GROUP_WAYS, INTERVAL_SYSTEM_GROUP} from 'store/widgets/constants';
import IntervalGroupModal from './IntervalGroupModal';
import React from 'react';

export default {
	component: IntervalGroupModal,
	title: 'Containers/IntervalGroupModal'
};

const Template = args => <IntervalGroupModal {...args} onClose={action('onClose')} onSubmit={action('onSubmit')} />;

export const Component = Template.bind({});

Component.args = {
	attribute: {
		title: 'Интервал',
		type: ATTRIBUTE_TYPES.dtInterval
	},
	value: {
		data: INTERVAL_SYSTEM_GROUP.SECOND,
		way: GROUP_WAYS.SYSTEM
	}
};
