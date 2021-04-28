import {action} from '@storybook/addon-actions';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {GROUP_WAYS} from 'store/widgets/constants';
import React from 'react';
import StringGroupModal from './StringGroupModal';

export default {
	component: StringGroupModal,
	title: 'Containers/StringGroupModal'
};

const Template = args => <StringGroupModal {...args} onClose={action('onClose')} onSubmit={action('onSubmit')} />;

export const Component = Template.bind({});

Component.args = {
	attribute: {
		title: 'Строка',
		type: ATTRIBUTE_TYPES.string
	},
	value: {
		data: '',
		way: GROUP_WAYS.SYSTEM
	}
};
