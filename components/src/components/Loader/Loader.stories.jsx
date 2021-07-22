import Loader from './Loader';
import React from 'react';

export default {
	component: Loader,
	title: 'Atoms/Loader'
};

const Template = args => {
	return <div style={{width: 300}}><Loader {...args} /></div>;
};

export const Default = Template.bind({});

Default.args = {
	size: 25
};
