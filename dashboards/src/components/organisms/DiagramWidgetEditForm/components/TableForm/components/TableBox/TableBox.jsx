// @flow
import BodySettingsBox from './components/BodySettingsBox';
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import {FIELDS} from 'DiagramWidgetEditForm';
import HeaderSettingsBox from './components/HeaderSettingsBox';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import type {TableBodySettings, TableHeaderSettings} from 'store/widgets/data/types';

export class TableBox extends PureComponent<Props> {
	handleChangeBodySettings = (bodyName: string, settings: TableBodySettings) => {
		const {data, name, onChange} = this.props;

		onChange(name, {
			...data,
			[bodyName]: settings
		});
	};

	handleChangeHeaderSettings = (settings: TableHeaderSettings) => {
		const {data, name, onChange} = this.props;

		onChange(name, {
			...data,
			[FIELDS.columnHeader]: settings
		});
	};

	renderHeader = () => {
		const {data} = this.props;
		return <HeaderSettingsBox data={data[FIELDS.columnHeader]} onChange={this.handleChangeHeaderSettings} />;
	};

	renderTableBody = () => {
		const {data} = this.props;
		const name = FIELDS.body;

		return (
			<BodySettingsBox
				data={data[name]}
				name={name}
				onChange={this.handleChangeBodySettings}
			/>
		);
	};

	render () {
		return (
			<CollapsableFormBox title="Таблица">
				{this.renderHeader()}
				{this.renderTableBody()}
			</CollapsableFormBox>
		);
	}
}

export default TableBox;
