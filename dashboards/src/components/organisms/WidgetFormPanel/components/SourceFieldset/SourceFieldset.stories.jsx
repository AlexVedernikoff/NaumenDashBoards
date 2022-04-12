// @flow
import {action} from '@storybook/addon-actions';
import React from 'react';
import SourceFieldset from './SourceFieldset';
import {useArgs} from '@storybook/client-api';

const fullSettings = {
	computable: false,
	dataSetIndex: 0,
	error: undefined,
	filterList: [
		{id: 1, label: 'filter1', value: '[{"f":1}]'},
		{id: 2, label: 'filter2', value: '[{"f":2}]'},
		{id: 3, label: 'filter3', value: '[{"f":3}]'}
	],
	name: '132',
	removable: false,
	sources: {
		KB: {
			children: ['KB$article', 'KB$KBArticle'],
			id: 'KB',
			loading: false,
			parent: null,
			uploaded: true,
			value: {
				hasDynamic: false,
				label: 'База знаний',
				value: 'KB'
			}
		},
		KB$KBArticle: {
			children: null,
			id: 'KB$KBArticle',
			loading: false,
			parent: 'KB',
			uploaded: true,
			value: {
				hasDynamic: false,
				label: 'Черновик статьи БЗ',
				value: 'KB$KBArticle'
			}
		},
		KB$article: {
			children: null,
			id: 'KB$article',
			loading: false,
			parent: 'KB',
			uploaded: true,
			value: {
				hasDynamic: false,
				label: 'Статья базы знаний',
				value: 'KB$article'
			}
		}
	},
	usesFilter: true,
	value: {
		dataKey: '6075be4d-9145-4d93-8860-33db81a64edb',
		indicators: [
			{
				'aggregation': 'COUNT_CNT',
				'attribute': null
			}
		],
		parameters: [
			{
				'attribute': null,
				'group': 'OVERLAP'
			}
		],
		source: {
			descriptor: '',
			filterId: null,
			value: {
				hasDynamic: true,
				label: 'Запрос',
				value: 'serviceCall'
			}
		},
		sourceForCompute: false
	}
};

export default {
	component: SourceFieldset,
	title: 'Organisms/WidgetFormPanel/Components/SourceFieldset'
};

const Template = args => {
	const [{value}, updateArgs] = useArgs();

	const onChangeDataSet = (name, source) => {
		action('onChange')(name, source);
		updateArgs({
			dataSet: {...args.dataSet, source}
		});
	};

	const onAction = actionName => (...args) => {
		action(actionName)(args);
	};

	return (
		<div style={{width: 300}}>
			<SourceFieldset
				{...args}
				onChangeDataSet={onChangeDataSet}
				onChangeForCompute={onAction('onChangeForCompute')}
				onFetchAttributes={onAction('onFetchAttributes')}
				onFetchDynamicAttributes={onAction('onFetchDynamicAttributes')}
				onRemove={onAction('onRemove')}
				openFilterForm={onAction('openFilterForm')}
				value={value}
			/>
		</div>
	);
};

export const AutoSettings = Template.bind({});

AutoSettings.args = {...fullSettings};

export const NoFilterSettings = Template.bind({});

NoFilterSettings.args = {...fullSettings, removable: true, usesFilter: false};
