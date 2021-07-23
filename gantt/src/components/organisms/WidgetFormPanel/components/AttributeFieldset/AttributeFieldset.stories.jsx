import {action} from '@storybook/addon-actions';
import AttributeFieldset from './AttributeFieldset';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import React from 'react';
import {useArgs} from '@storybook/client-api';

export default {
	component: AttributeFieldset,
	title: 'Organisms/WidgetFormPanel/Components/AttributeFieldset'
};

const Template = args => {
	const [{value}, updateArgs] = useArgs();
	const onSelect = (event, index) => {
		const {value: newValue} = event;

		action('onSelect')(event, index);
		updateArgs({
			value: newValue
		});
	};

	return (
		<div style={{width: 300}}>
			<AttributeFieldset {...args} onChangeLabel={onSelect} onSelect={onSelect} value={value} />
		</div>
	);
};

export const WithOutChild = Template.bind({});

WithOutChild.args = {
	attributes: {},
	components: {
		Field: () => 'поле'
	},
	dataKey: '',
	dynamicGroups: {},
	fetchAttributes: () => null,
	fetchDynamicAttributeGroups: () => null,
	fetchDynamicAttributes: () => null,
	fetchRefAttributes: () => null,
	refAttributes: {},
	source: {
		descriptor: '',
		value: {
			label: 'Источник',
			value: 'source'
		}
	},
	sources: {},
	value: {
		code: 'code',
		title: 'Атрибут',
		type: ATTRIBUTE_TYPES.string
	}
};

export const WithChild = Template.bind({});

WithChild.args = {
	...WithOutChild.args,
	value: {
		code: 'code',
		ref: {
			code: 'child-code',
			title: 'Дочерний атрибут',
			type: ATTRIBUTE_TYPES.string
		},
		title: 'Атрибут',
		type: ATTRIBUTE_TYPES.object
	}
};
