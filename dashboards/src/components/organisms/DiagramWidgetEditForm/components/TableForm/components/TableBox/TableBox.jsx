// @flow
import {BodySettingsBox, HeaderSettingsBox} from './components';
import {FIELDS} from 'DiagramWidgetEditForm';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import type {TableBodySettings, TableHeaderSettings} from 'store/widgets/data/types';
import {ToggableFormBox} from 'components/molecules';

export class TableBox extends PureComponent<Props> {
	handleChangeBodySettings = (bodyName: string, settings: TableBodySettings) => {
		const {data, name, onChange} = this.props;

		onChange(name, {
			...data,
			[bodyName]: settings
		});
	};

	handleChangeHeaderSettings = (headerName: string, settings: TableHeaderSettings) => {
		const {data, name, onChange} = this.props;

		onChange(name, {
			...data,
			[headerName]: settings
		});
	};

	renderFieldDivider = () => <div className={styles.fieldDivider}><hr /></div>;

	renderHeader = (name: string, label: string) => {
		const {data} = this.props;
		return <HeaderSettingsBox data={data[name]} label={label} name={name} onChange={this.handleChangeHeaderSettings} />;
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
			<ToggableFormBox title="Таблица">
				{this.renderHeader(FIELDS.columnHeader, 'Заголовок столбца')}
				{this.renderFieldDivider()}
				{this.renderHeader(FIELDS.rowHeader, 'Заголовок строки')}
				{this.renderFieldDivider()}
				{this.renderTableBody()}
			</ToggableFormBox>
		);
	}
}

export default TableBox;
