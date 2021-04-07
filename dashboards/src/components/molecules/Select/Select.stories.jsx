import {action} from '@storybook/addon-actions';
import Container from 'components/atoms/Container';
import {DEFAULT_PROPS} from './constants';
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
	...DEFAULT_PROPS,
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

const renderTransparentValueContainer = props => {
		const {className, onClick} = props;

		return (
			<Container className={className} onClick={onClick}>
				<div>Выберите значение</div>
			</Container>
		);
};

Transparent.args = {
	...DEFAULT_PROPS,
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
	...DEFAULT_PROPS,
	options: bigOptionsList,
	placeholder: 'Выберите элемент',
	value: null
};
