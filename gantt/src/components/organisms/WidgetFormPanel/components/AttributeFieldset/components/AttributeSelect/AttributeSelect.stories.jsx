import {action} from '@storybook/addon-actions';
import AttributeSelect from './AttributeSelect';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import React from 'react';
import {useArgs} from '@storybook/client-api';

export default {
	component: AttributeSelect,
	excludeStories: /.*props$/,
	title: 'Organisms/WidgetFormPanel/Components/AttributeFieldset/Components/AttributeSelect'
};

const Template = args => {
	const [{value}, updateArgs] = useArgs();
	const onSelect = event => {
		const {value: newValue} = event;

		action('onSelect')(event);
		updateArgs({
			value: newValue
		});
	};
	const onChangeLabel = title => {
		action('onChangeLabel')(title);
		updateArgs({
			value: {...value, title}
		});
	};

	return (
		<div style={{width: 300}}>
			<AttributeSelect {...args} onChangeLabel={onChangeLabel} onSelect={onSelect} value={value} />
		</div>
	);
};

const options = [
	{
		code: 'code1',
		title: 'Атрибут 1',
		type: ATTRIBUTE_TYPES.string
	},
	{
		code: 'code2',
		title: 'Attribute 2',
		type: ATTRIBUTE_TYPES.integer
	}
];

export const props = {
	...AttributeSelect.defaultProps,
	components: {
		Field: () => 'поле'
	},
	options,
	value: options[0]
};

export const Component = Template.bind({});

Component.args = props;
