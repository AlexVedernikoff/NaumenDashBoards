import {action} from '@storybook/addon-actions';
import FiltersOnWidget from './FiltersOnWidget';
import React from 'react';
import {useArgs} from '@storybook/client-api';

export default {
	component: FiltersOnWidget,
	title: 'Organisms/WidgetFormPanel/Components/FiltersOnWidget'
};

const DefaultTemplate = args => {
	const [{values}, updateArgs] = useArgs();

	const onAddNewFilterItem = () => {
		action('onAddNewFilterItem')();
		updateArgs({
			filters: [
				...(values ?? []),
				{ attribute: null, dataKey: null, label: '' }
			]
		});
	};

	return (
		<div style={{width: 300}}>
			<FiltersOnWidget {...args} onAddNewFilterItem={onAddNewFilterItem} />
		</div>
	);
};

export const Default = DefaultTemplate.bind({});

Default.args = {
	dataSets: [],
	filters: []
};
