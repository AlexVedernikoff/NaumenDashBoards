import {action} from '@storybook/addon-actions';
import ColorField from './ColorField';
import React from 'react';
import {useArgs} from '@storybook/client-api';

export default {
	component: ColorField,
	title: 'Organisms/DiagramWidgetEditForm/Components/ColorsBox/Components/ColorField'
};

export const Component = args => {
	const [{value}, updateArgs] = useArgs();
	const onChange = ({value}) => updateArgs({value});

	return <ColorField {...args} onChange={onChange} onRemove={action('onRemove')} value={value} />;
};

Component.args = {
	label: 'test',
	name: 'name',
	removable: true,
	value: 'red'
};
