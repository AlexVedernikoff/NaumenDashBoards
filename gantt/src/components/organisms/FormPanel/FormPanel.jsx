// @flow
import Box from './components/Box';
import {connect} from 'react-redux';
import {deepClone} from 'src/helpers';
import {functions, props} from './selectors';
import type {Props} from './types';
import React from 'react';

const FormPanel = (props: Props) => {
	const {resources} = props;

	const handleUpdateSettings = (value) => {
		const {setResourceSettings} = props;
		const newSettings = deepClone(resources);

		newSettings[0].source.value = value;
		setResourceSettings(newSettings);
	};

	const renderForm = () => {
		const {sources} = props;

		return (
			<Box
				name='Ресурс/Работа'
				onChange={handleUpdateSettings}
				options={sources}
				value={resources[0].source.value}
			/>
		);
	};

	return renderForm();
};

export default connect(props, functions)(FormPanel);
