import {action} from '@storybook/addon-actions';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {GROUP_WAYS} from 'store/widgets/constants';
import NumberGroupModal from './NumberGroupModal';
import React from 'react';

export default {
	component: NumberGroupModal,
	title: 'Containers/NumberGroupModal'
};

const Template = args => <NumberGroupModal {...args} onClose={action('onClose')} onSubmit={action('onSubmit')} />;

export const Integer = Template.bind({});

Integer.args = {
	attribute: {
		title: 'Число',
		type: ATTRIBUTE_TYPES.integer
	},
	value: {
		data: '',
		way: GROUP_WAYS.SYSTEM
	}
};

export const Float = Template.bind({});

Float.args = {
	...Integer.args,
	attribute: {
		...Integer.args.attribute,
		type: ATTRIBUTE_TYPES.double
	}
};
