import {action} from '@storybook/addon-actions';
import MainSelect from './MainSelect';
import React from 'react';
import {useArgs} from '@storybook/client-api';

export default {
	component: MainSelect,
	title: 'Organisms/WidgetFormPanel/Components/AttributeFieldset/Components/MainSelect'
};

const Template = args => {
	const [{value}, updateArgs] = useArgs();
	const onSelect = (event) => {
		const {value: newValue} = event;

		action('onSelect')(event);
		updateArgs({
			value: newValue
		});
	};
	const onChangeLabel = (event) => {
		const {label: title} = event;

		action('onChangeLabel')(event);
		updateArgs({
			value: {...value, title}
		});
	};

	return (
		<div style={{width: 300}}>
			<MainSelect {...args} onChangeLabel={onChangeLabel} onSelect={onSelect} value={value} />
		</div>
	);
};

export const Component = Template.bind({});

Component.args = {
	attributes: {},
	components: {
		Field: () => 'поле'
	},
	dynamicGroups: {},
	fetchAttributes: () => undefined,
	fetchDynamicAttributeGroups: () => undefined,
	fetchDynamicAttributes: () => undefined,
	source: {
		label: 'Источник',
		value: 'source'
	},
	sources: {}
};
