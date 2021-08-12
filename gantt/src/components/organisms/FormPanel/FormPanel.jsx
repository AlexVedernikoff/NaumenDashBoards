// @flow
import {connect} from 'react-redux';
import {deepClone} from 'src/helpers';
import {functions, props} from './selectors';
import type {Props} from './types';
import React from 'react';
import Resource from './components/Resource';
import Work from './components/Work';

const defaultObject = {
	attributeSettings: [
		{
			attribute: {
			},
			code: 'title',
			title: 'name'
		}
	],
	communicationResourceAttribute: null,
	communicationWorkAttribute: null,
	level: 0,
	nested: false,
	source: {
		descriptor: '',
		value: {
			label: 'Запрос',
			value: 'serviceCall'
		}
	},
	type: 'RES'
};

export const ItemTypes = ['RESOURCES', 'WORK'];
export const TableColumnNames = ['Название', 'Дата'];

const FormPanel = (props: Props) => {
	const {resources} = props;

	const handleAddNewBlock = (index, value) => {
		const {setResourceSettings} = props;
		setResourceSettings([...resources.slice(0, index + 1), {...defaultObject, level: resources[index].level, type: value}, ...resources.slice(index + 1)]);
	};

	const handleUpdateSettings = (value, index) => {
		const {setResourceSettings} = props;
		const newSettings = deepClone(resources);

		newSettings[index] = value;
		setResourceSettings(newSettings);
	};

	const getFormByType = (item, index) => {
		const {sources} = props;
		const FormByType = item.type === 'WORK' ? Work : Resource;

		return (
			<FormByType
				handleAddNewBlock={(value) => handleAddNewBlock(index, value)}
				key={item.source.value?.value + index}
				level={item.level || (item.nested ? 1 : 0)}
				onChange={(value) => handleUpdateSettings(value, index)}
				options={sources}
				value={item}
			/>
		);
	};

	return resources.map((item, index) => getFormByType(item, index));
};

export default connect(props, functions)(FormPanel);
