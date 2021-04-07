// @flow
import BodySettingsBox from 'TableWidgetForm/components/BodySettingsBox';
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import HeaderSettingsBox from 'TableWidgetForm/components/HeaderSettingsBox';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import type {TableBodySettings, TableHeaderSettings} from 'store/widgets/data/types';

export class TableBox extends PureComponent<Props> {
	handleChangeBodySettings = (settings: TableBodySettings) => {
		const {name, onChange, value} = this.props;

		onChange(name, {
			...value,
			body: settings
		});
	};

	handleChangeHeaderSettings = (settings: TableHeaderSettings) => {
		const {name, onChange, value} = this.props;

		onChange(name, {
			...value,
			columnHeader: settings
		});
	};

	render () {
		const {body, columnHeader} = this.props.value;

		return (
			<CollapsableFormBox title="Таблица">
				<HeaderSettingsBox onChange={this.handleChangeHeaderSettings} value={columnHeader} />
				<BodySettingsBox onChange={this.handleChangeBodySettings} value={body} />
			</CollapsableFormBox>
		);
	}
}

export default TableBox;
