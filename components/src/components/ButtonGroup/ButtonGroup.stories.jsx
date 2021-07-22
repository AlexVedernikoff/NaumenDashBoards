import Button from 'components/Button';
import ButtonGroup from './ButtonGroup';
import React from 'react';
import {VARIANTS} from 'components/Button/constants';

export default {
	component: ButtonGroup,
	title: 'Molecules/ButtonGroup'
};

const Template = args => {
	return <div style={{width: 300}}><ButtonGroup {...args} >{args.children}</ButtonGroup></div>;
};

export const Default = Template.bind({});

Default.args = {
	children: (
		<>
			<Button onClick={() => {}} variant={VARIANTS.GRAY}>Личный</Button>
			<Button onClick={() => {}} variant={VARIANTS.INFO}>Общий</Button>
		</>
	),
	disabled: false
};
