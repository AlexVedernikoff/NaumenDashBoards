import {action} from '@storybook/addon-actions';
import React from 'react';
import {SourceControl} from './SourceControl';
import {useArgs} from '@storybook/client-api';

export default {
	component: SourceControl,
	title: 'Organisms/AttributeCreatingModal/components/SourceControl'
};

const Template = args => {
	const [{value}, updateArgs] = useArgs();
	const onSelect = (index, name, value, type) => {
		action('onSelect')(index, name, value, type);
		updateArgs({value});
	};

	return (
		<div style={{width: 60}}>
			<SourceControl
				{...args}
				onClick={action('onClick')}
				onFetch={action('onFetch')}
				onSelect={onSelect} value={value}
			/>
		</div>
	);
};

export const Component = Template.bind({});

Component.args = {
	index: 0,
	options: {
		attr1: {
			children: null,
			id: 'attr1',
			parent: 'dataKey1',
			value: {
				code: 'attr1',
				title: 'attr1'
			}
		},
		attr2: {
			children: null,
			id: 'attr2',
			parent: 'dataKey1',
			value: {
				code: 'attr2',
				title: 'attr2'
			}
		},
		dataKey1: {
			children: ['attr1', 'attr2'],
			id: 'dataKey1',
			value: {
				label: 'Источник 1',
				value: 'source1'
			}
		}
	}
};
