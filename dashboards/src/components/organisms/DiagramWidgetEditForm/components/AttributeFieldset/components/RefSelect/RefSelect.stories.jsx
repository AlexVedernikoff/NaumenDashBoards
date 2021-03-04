import {action} from '@storybook/addon-actions';
import React from 'react';
import RefSelect from './RefSelect';
import {useArgs} from '@storybook/client-api';

export default {
	component: RefSelect,
	title: 'Organisms/DiagramWidgetEditForm/Components/AttributeFieldset/Components/RefSelect'
};

const Template = args => {
	const [{value}, updateArgs] = useArgs();
	const onSelect = (event) => {
		const {value: newValue} = event;

		action('onSelect')(event);
		updateArgs({
			value: newValue
		});
	};
	const onChangeLabel = (title) => {
		action('onChangeLabel')(title);
		updateArgs({
			value: {...value, title}
		});
	};

	return (
		<div style={{width: 300}}>
			<RefSelect
				{...args}
				onChangeLabel={onChangeLabel}
				onDrop={action('onDrop')}
				onSelect={onSelect}
				value={value}
			/>
		</div>
	);
};

export const Component = Template.bind({});

Component.args = {
	components: {
		Field: () => 'поле'
	},
	fetchRefAttributes: () => undefined,
	parent: {
		code: 'code',
		title: 'parent - attribute'
	},
	refAttributes: {},
	value: {
		code: 'code',
		title: 'attribute'
	}
};
