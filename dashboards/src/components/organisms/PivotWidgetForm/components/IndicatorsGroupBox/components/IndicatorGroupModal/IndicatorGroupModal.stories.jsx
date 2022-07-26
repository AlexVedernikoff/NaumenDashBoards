// @flow
import {action} from '@storybook/addon-actions';
import IndicatorGroupModal from './IndicatorGroupModal';
import {INDICATOR_GROUPING_TYPE} from 'store/widgets/data/constants';
import React, {useState} from 'react';

export default {
	component: IndicatorGroupModal,
	title: 'Organisms/IndicatorGroupBox/IndicatorGroupModal'
};

const Template = args => {
	const [value, setValue] = useState(args.value);
	const ChangedValue = newVal => setValue(newVal);

	return <IndicatorGroupModal {...args} onChange={ChangedValue} onClose={action('onClose')} value={value} />;
};

const SIMPLE_VALUE = [
	{
		checked: false,
		hasBreakdown: false,
		key: 'indicator-1',
		label: 'indicator1',
		type: INDICATOR_GROUPING_TYPE.INDICATOR_INFO
	},
	{
		checked: false,
		hasBreakdown: false,
		key: 'indicator-2',
		label: 'indicator2',
		type: INDICATOR_GROUPING_TYPE.INDICATOR_INFO
	},
	{
		checked: false,
		hasBreakdown: false,
		key: 'indicator-3',
		label: 'indicator3',
		type: INDICATOR_GROUPING_TYPE.INDICATOR_INFO
	},
	{
		checked: false,
		hasBreakdown: false,
		key: 'indicator-4',
		label: 'indicator4',
		type: INDICATOR_GROUPING_TYPE.INDICATOR_INFO
	}
];

export const DefaultModal = Template.bind({}, {value: SIMPLE_VALUE});
