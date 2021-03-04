import {action} from '@storybook/addon-actions';
import {MainSelectList} from './MainSelectList';
import {props} from 'DiagramWidgetEditForm/components/AttributeFieldset/components/AttributeSelect/AttributeSelect.stories';
import React from 'react';
import {useArgs} from '@storybook/client-api';

export default {
	component: MainSelectList,
	title: 'Organisms/DiagramWidgetEditForm/Components/AttributeFieldset/Components/MainSelectList'
};

const Template = args => {
	const [{value}, updateArgs] = useArgs();
	const onSelect = (newValue) => {
		action('onSelect')(newValue);
		updateArgs({
			value: newValue
		});
	};

	return (
		<div style={{width: 300}}>
			<MainSelectList {...args} onSelect={onSelect} value={value} />
		</div>
	);
};

export const WithDynamicAttrs = Template.bind({});

const source = {
	label: 'Источник',
	value: 'source'
};

const dataKey = 'key';

WithDynamicAttrs.args = {
	...props,
	dataKey,
	dynamicGroups: {
		[dataKey]: {
			data: {
				'dyn-code': {
					value: {
						code: 'dyn-code',
						title: 'Динамическая группа'
					}
				}
			},
			loading: false
		}
	},
	fetchDynamicAttributeGroups: () => undefined,
	fetchDynamicAttributes: () => undefined,
	getOptionLabel: attribute => attribute?.title ?? '',
	getOptionValue: attribute => attribute?.code ?? '',
	source: {
		descriptor: 'test',
		value: source
	},
	sources: {
		[source.value]: {
			value: {
				...source,
				hasDynamic: true
			}
		}
	}
};

export const WithoutDynamicAttrs = Template.bind({});

WithoutDynamicAttrs.args = {
	...WithDynamicAttrs.args,
	source: {
		descriptor: '',
		value: null
	}
};
