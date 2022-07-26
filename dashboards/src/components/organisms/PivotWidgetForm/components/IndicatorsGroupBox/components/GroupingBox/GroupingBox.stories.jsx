// @flow
import {action} from '@storybook/addon-actions';
import GroupingBox from './GroupingBox';
import React from 'react';
import {useArgs} from '@storybook/client-api';

export default {
	component: GroupingBox,
	title: 'Organisms/IndicatorGroupBox/GroupingBox'
};

const defaultProps = {
	checked: false,
	className: '',
	hasSum: false,
	key: '',
	name: '',
	size: 1

};

const Template = args => {
	const [newArgs, updateArgs] = useArgs();

	const ChangedHasSum = newVal => {
		updateArgs({
			hasSum: newVal
		});
	};

	const ChangedName = name => {
		updateArgs({
			name
		});
	};

	return (
		<GroupingBox
			{...newArgs}
			onChangedHasSum={ChangedHasSum}
			onChangedName={ChangedName}
			onClose={action('onClose')}
		/>
	);
};

export const Size1 = Template.bind({});

Size1.args = {
	...defaultProps,
	key: '2230d498-41d0-46de-abe6-da5c3708a2a9',
	name: 'Size 1'
};

export const Size2 = Template.bind({});

Size2.args = {
	...defaultProps,
	key: '20e4744b-9d02-4e21-8e2e-0eff9d907f1e',
	name: 'Size 2',
	size: 2
};

export const Checked = Template.bind({});

Checked.args = {
	...defaultProps,
	checked: true,
	key: 'ad6d25c4-2dfe-4b04-8088-c7b5f67a903a',
	name: 'Checked'
};

export const LongName = Template.bind({});

LongName.args = {
	...defaultProps,
	key: 'e8372882-0bc4-4637-8242-8fd00b1d836e',
	name: 'Long name Long name Long name Long name Long name Long name Long name Long name Long name'
};

export const hasSum = Template.bind({});

hasSum.args = {
	...defaultProps,
	hasSum: true,
	key: '544c11b1-e09d-4e29-8e10-539d66d5624a',
	name: 'has sum'
};
