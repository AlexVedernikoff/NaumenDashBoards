import {action} from '@storybook/addon-actions';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {GROUP_WAYS} from 'store/widgets/constants';
import React from 'react';
import StateGroupModal from './StateGroupModal';

export default {
	component: StateGroupModal,
	title: 'Containers/StateGroupModal'
};

const Template = args => <StateGroupModal {...args} onClose={action('onClose')} onSubmit={action('onSubmit')} />;

export const Basic = Template.bind({});

Basic.args = {
	attribute: {
		title: 'Статус',
		type: ATTRIBUTE_TYPES.state
	},
	value: {
		data: '',
		way: GROUP_WAYS.SYSTEM
	}
};
