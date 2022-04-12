// @flow
import {action} from '@storybook/addon-actions';
import {debounce} from 'helpers';
import React, {createRef} from 'react';
import SearchInput from './SearchInput';
import {useArgs} from '@storybook/client-api';

export default {
	component: SearchInput,
	title: 'Atoms/SearchInput'
};

const Template = args => {
	const [{value}, updateArgs] = useArgs();
	const updateArgsDebounce = debounce(updateArgs, 1000);

	const onChange = value => {
		action('onChange')(value);
		updateArgsDebounce({value});
	};

	const onFocus = event => {
		action('onFocus')(event);
	};

	return (
		<div style={{backgroundColor: '#ffffff', width: '300px'}}>
			<SearchInput
				{...args}
				onChange={onChange}
				onFocus={onFocus}
				value={value}
			/>
		</div>
	);
};

export const Default = Template.bind({});

Default.args = {
	forwardedRef: createRef(),
	value: '123'
};
