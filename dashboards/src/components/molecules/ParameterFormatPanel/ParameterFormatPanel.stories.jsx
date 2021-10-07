// @flow
import {action} from '@storybook/addon-actions';
import {AXIS_FORMAT_TYPE, LABEL_FORMATS} from 'store/widgets/data/constants';
import {ParameterFormatPanel} from './ParameterFormatPanel';
import React from 'react';
import {useArgs} from '@storybook/client-api';

export default {
	argTypes: {
	},
	component: ParameterFormatPanel,
	title: 'Molecules/ParameterFormatPanel'
};

const Template = args => {
	const [{value}, updateArgs] = useArgs();
	const onChange = (value) => {
		updateArgs({value});
		action('onChange')(value);
	};

	return (
		<div style={{width: 300}}>
			<ParameterFormatPanel
				{...args}
				onChange={onChange}
				value={value}
			/>
		</div>
	);
};

export const LabelParameterFormatPanel = Template.bind({});

LabelParameterFormatPanel.args = {
	label: 'Label',
	value: {
		labelFormat: LABEL_FORMATS.TITLE_CODE,
		type: AXIS_FORMAT_TYPE.LABEL_FORMAT
	}
};

export const NumberParameterFormatPanel = Template.bind({});

NumberParameterFormatPanel.args = {
	label: 'Число',
	value: {
		type: AXIS_FORMAT_TYPE.NUMBER_FORMAT
	}
};

export const IntegerParameterFormatPanel = Template.bind({});

IntegerParameterFormatPanel.args = {
	label: 'Целое число',
	value: {
		type: AXIS_FORMAT_TYPE.INTEGER_FORMAT
	}
};
