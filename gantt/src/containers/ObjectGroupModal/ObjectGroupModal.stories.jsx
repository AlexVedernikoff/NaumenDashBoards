import {action} from '@storybook/addon-actions';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {GROUP_WAYS} from 'store/widgets/constants';
import ObjectGroupModal from './ObjectGroupModal';
import React from 'react';

export default {
	component: ObjectGroupModal,
	title: 'Containers/ObjectGroupModal'
};

const Template = (args) => <ObjectGroupModal {...args} onClose={action('onClose')} onSubmit={action('onSubmit')} />;

export const Object = Template.bind({});

Object.args = {
	attribute: {
		title: 'Объект',
		type: ATTRIBUTE_TYPES.object
	},
	source: {
		label: 'источник',
		source: 'source'
	},
	value: {
		data: '',
		way: GROUP_WAYS.SYSTEM
	}
};
