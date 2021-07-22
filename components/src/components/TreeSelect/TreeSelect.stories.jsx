import {action} from '@storybook/addon-actions';
import {getTree} from './utils/helpers';
import React, {useState} from 'react';
import TreeSelect from './TreeSelect';

export default {
	component: TreeSelect,
	title: 'Molecules/TreeSelect'
};

const Template = args => {
	const [value, setValue] = useState(args.value);
	const onSelect = (event) => {
		const {value: node} = event;

		action('onSelect')(event);
		setValue(node.value);
	};

	return (
		<div style={{width: 300}}>
			<TreeSelect
				{...args}
				onClick={action('onClick')}
				onRemove={action('onRemove')}
				onSelect={onSelect}
				value={value}
			/>
		</div>
	);
};

export const Default = Template.bind({});

Default.args = {
	options: getTree(2, 5)
};
