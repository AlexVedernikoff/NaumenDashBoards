// @flow
import BodySettingsBox from 'PivotWidgetForm/components/BodySettingsBox';
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import {DEFAULT_TABLE_SETTINGS} from 'store/widgetForms/pivotForm/constants';
import HeaderSettingsBox from 'PivotWidgetForm/components/HeaderSettingsBox';
import type {PivotBodySettings, PivotHeaderSettings} from 'store/widgets/data/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import t from 'localization';

export class PivotStyleBox extends PureComponent<Props> {
	handleChangeBodySettings = (settings: PivotBodySettings) => {
		const {name, onChange, value} = this.props;

		onChange(name, {
			...value,
			body: settings
		});
	};

	handleChangeHeaderSettings = (settings: PivotHeaderSettings) => {
		const {name, onChange, value} = this.props;

		onChange(name, {
			...value,
			columnHeader: settings
		});
	};

	render () {
		const {body, columnHeader} = this.props.value;

		return (
			<CollapsableFormBox title={t('PivotWidgetForm::PivotStyleBox')}>
				<HeaderSettingsBox onChange={this.handleChangeHeaderSettings} value={columnHeader} />
				<BodySettingsBox onChange={this.handleChangeBodySettings} value={body} />
			</CollapsableFormBox>
		);
	}
}

export default PivotStyleBox;
