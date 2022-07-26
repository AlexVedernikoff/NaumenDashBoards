// @flow
import {INDICATOR_GROUPING_TYPE} from 'store/widgets/data/constants';
import IndicatorHeaderGrid from './IndicatorHeaderGrid';
import React, {useState} from 'react';

export default {
	component: IndicatorHeaderGrid,
	title: 'Organisms/IndicatorGroupBox/IndicatorHeaderGrid'
};

const Template = args => {
	const [value, setValue] = useState(args.value);
	const ChangedValue = newVal => setValue(newVal);

	return <IndicatorHeaderGrid {...args} onChange={ChangedValue} value={value} />;
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

const NORMAL_VALUE = [
	{
		checked: false,
		children: [
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
				hasBreakdown: true,
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
		],
		hasSum: true,
		key: '2fe66a5f-7305-427a-9bcd-06b5cbfe4738',
		label: 'Group 1',
		type: INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO
	},
	{
		checked: false,
		hasBreakdown: false,
		key: 'indicator-5',
		label: 'indicator5',
		type: INDICATOR_GROUPING_TYPE.INDICATOR_INFO
	}
];

const HARD_VALUE = [
	{
		checked: false,
		children: [
			{
				checked: false,
				hasBreakdown: false,
				key: 'indicator-11',
				label: 'indicator1',
				type: INDICATOR_GROUPING_TYPE.INDICATOR_INFO
			},
			{
				checked: false,
				hasBreakdown: false,
				key: 'indicator-12',
				label: 'indicator2',
				type: INDICATOR_GROUPING_TYPE.INDICATOR_INFO
			}
		],
		hasSum: false,
		key: '91e10049-bdd0-4de2-a86f-eb752bf662a5',
		label: 'Group 1',
		type: INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO
	},
	{
		checked: false,
		children: [
			{
				checked: false,
				children: [],
				hasSum: false,
				key: 'df42d332-f8ca-4228-9869-2e69fde007f8',
				label: 'Sub Group 2.1',
				type: INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO
			},
			{
				checked: false,
				children: [
					{
						checked: false,
						hasBreakdown: false,
						key: 'indicator-21',
						label: 'indicator3',
						type: INDICATOR_GROUPING_TYPE.INDICATOR_INFO
					},
					{
						checked: false,
						hasBreakdown: false,
						key: 'indicator-22',
						label: 'indicator4',
						type: INDICATOR_GROUPING_TYPE.INDICATOR_INFO
					}
				],
				hasSum: false,
				key: '20f77273-9d27-4c0a-a9af-da6f855ff1c3',
				label: 'Sub Group 2.2',
				type: INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO
			},
			{
				checked: false,
				hasBreakdown: false,
				key: 'indicator-23',
				label: 'indicator5',
				type: INDICATOR_GROUPING_TYPE.INDICATOR_INFO
			}
		],
		hasSum: false,
		key: '6a245eca-edf2-4809-8539-541cf900bef2',
		label: 'Group 2',
		type: INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO
	},
	{
		checked: false,
		hasBreakdown: false,
		key: 'indicator-01',
		label: 'indicator6',
		type: INDICATOR_GROUPING_TYPE.INDICATOR_INFO
	},
	{
		checked: false,
		hasBreakdown: false,
		key: 'indicator-02',
		label: 'indicator7',
		type: INDICATOR_GROUPING_TYPE.INDICATOR_INFO
	}
];

export const Simple = Template.bind({}, {value: SIMPLE_VALUE});

export const Normal = Template.bind({}, {value: NORMAL_VALUE});

export const Hard = Template.bind({}, {value: HARD_VALUE});
