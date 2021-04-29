// @flow
import {action} from '@storybook/addon-actions';
import Container from 'components/atoms/Container';
import type {Props as ContainerProps} from 'components/atoms/Container/types';
import React from 'react';
import Select from './Select';
import styles from './styles.story.less';
import {useArgs} from '@storybook/client-api';

export default {
	component: Select,
	title: 'Molecules/Select'
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

	return (
		<div style={{width: 300}}>
			<Select {...args} onChangeLabel={onSelect} onSelect={onSelect} value={value} />
		</div>
	);
};

export const Simple = Template.bind({});

Simple.args = {
	...Select.defaultProps,
	options: [
		{
			label: 'value1',
			value: 'value1'
		},
		{
			label: 'label2',
			value: 'value2'
		}
	],
	value: null
};

const TemplateTransparent = args => {
	return (
		<div style={{width: 300}}>
			<Select {...args} className={styles.transparent} />
		</div>
	);
};

export const Transparent = TemplateTransparent.bind({});

const renderTransparentValueContainer = (props: ContainerProps) => {
		const {className, onClick} = props;

		return (
			<Container className={className} onClick={onClick}>
				<div>Выберите значение</div>
			</Container>
		);
};

Transparent.args = {
	...Select.defaultProps,
	components: {
		ValueContainer: renderTransparentValueContainer
	},
	options: [
		{
			label: 'value1',
			value: 'value1'
		},
		{
			label: 'label2',
			value: 'value2'
		}
	],
	placeholder: 'Выберите элемент',
	value: null
};

const BigListTemplate = args => {
	return (
		<div style={{width: 300}}>
			<Select {...args} />
		</div>
	);
};

export const BigList = BigListTemplate.bind({});

const bigOptionsList = Array.from(Array(1000)).map((e, i) => ({label: `Option ${i}`, value: i}));

BigList.args = {
	...Select.defaultProps,
	options: bigOptionsList,
	placeholder: 'Выберите элемент',
	value: null
};
