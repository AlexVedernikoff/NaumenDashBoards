import {action} from '@storybook/addon-actions';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import CatalogItemGroupModal from './CatalogItemGroupModal';
import {GROUP_WAYS} from 'store/widgets/constants';
import React from 'react';

export default {
	component: CatalogItemGroupModal,
	title: 'Containers/CatalogItemGroupModal'
};

const Template = args => <CatalogItemGroupModal {...args} onClose={action('onClose')} onSubmit={action('onSubmit')} />;

export const Basic = Template.bind({});

Basic.args = {
	attribute: {
		title: 'Элемент справочника',
		type: ATTRIBUTE_TYPES.catalogItem
	},
	value: {
		data: '',
		way: GROUP_WAYS.SYSTEM
	}
};
