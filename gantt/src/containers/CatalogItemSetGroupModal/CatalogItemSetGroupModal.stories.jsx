import {action} from '@storybook/addon-actions';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import CatalogItemSetGroupModal from './CatalogItemSetGroupModal';
import {GROUP_WAYS} from 'store/widgets/constants';
import React from 'react';

export default {
	component: CatalogItemSetGroupModal,
	title: 'Containers/CatalogItemSetGroupModal'
};

const Template = args => <CatalogItemSetGroupModal {...args} onClose={action('onClose')} onSubmit={action('onSubmit')} />;

export const Basic = Template.bind({});

Basic.args = {
	attribute: {
		title: 'Набор элементов справочника',
		type: ATTRIBUTE_TYPES.catalogItemSet
	},
	value: {
		data: '',
		way: GROUP_WAYS.SYSTEM
	}
};
