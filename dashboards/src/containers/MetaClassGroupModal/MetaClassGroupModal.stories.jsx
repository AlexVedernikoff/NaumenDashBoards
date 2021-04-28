import {action} from '@storybook/addon-actions';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {GROUP_WAYS} from 'store/widgets/constants';
import MetaClassGroupModal from './MetaClassGroupModal';
import React from 'react';

export default {
	component: MetaClassGroupModal,
	title: 'Containers/MetaClassGroupModal'
};

const Template = (args) => {
	return <MetaClassGroupModal {...args} onClose={action('onClose')} onSubmit={action('onSubmit')} />;
};

export const Basic = Template.bind({});

Basic.args = {
	attribute: {
		title: 'Метакласс',
		type: ATTRIBUTE_TYPES.metaClass
	},
	value: {
		data: '',
		way: GROUP_WAYS.SYSTEM
	}
};
