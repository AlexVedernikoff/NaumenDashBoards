import {action} from '@storybook/addon-actions';
import FormBox from './FormBox';
import Icon, {ICON_NAMES} from 'components/Icon';
import React from 'react';

export default {
	component: FormBox,
	title: 'Molecules/FormBox'
};

const Template = args => {
	const onClick = () => {
		action('onClick')();
	};

	const props = {...args, onClick};

	return <div style={{width: 300}}><FormBox {...props}>{args.children}</FormBox></div>;
};

export const Default = Template.bind({});

Default.args = {
	children: <div style={{backgroundColor: '#d3d5d5', height: 100, textAlign: 'center'}}>Контент</div>,
	rightControl: <Icon name={ICON_NAMES.ARROW_BOTTOM} />,
	title: 'Показать'
};
