import {action} from '@storybook/addon-actions';
import React from 'react';
import WidgetForm, {TabbedWidgetForm} from './index';

export default {
	component: WidgetForm,
	decorators: [Story => <div style={{height: 400, width: 300}}><Story /></div>],
	title: 'Templates/WidgetForm'
};

const Template = args => (
	<WidgetForm {...args} onCancel={action('onCancel')} onSubmit={action('onSubmit')} />
);

export const Component = Template.bind({});

Component.args = {
	title: 'Название'
};

const TabbedTemplate = args => (
	<TabbedWidgetForm {...args} onCancel={action('onCancel')} onSubmit={action('onSubmit')} />
);

export const TabbedComponent = TabbedTemplate.bind({});

TabbedComponent.args = {
	children: activeTab => activeTab,
	title: 'Название'
};
