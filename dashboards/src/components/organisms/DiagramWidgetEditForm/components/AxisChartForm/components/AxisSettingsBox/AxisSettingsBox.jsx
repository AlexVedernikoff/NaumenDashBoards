// @flow
import Checkbox from 'components/atoms/Checkbox';
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import FormCheckControl from 'components/molecules/FormCheckControl';
import FormField from 'components/molecules/FormField';
import {MAX_TEXT_LENGTH} from 'components/constants';
import type {OnChangeInputEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import TextInput from 'components/atoms/TextInput';

export class AxisSettingsBox extends PureComponent<Props> {
	handleChangeSettings = ({name: propName, value}: OnChangeInputEvent) => {
		const {name, onChangeSettings, settings} = this.props;
		onChangeSettings(name, {...settings, [propName]: value});
	};

	render () {
		const {axisFieldName, axisName, onChangeAxisName, settings} = this.props;
		const {show, showName} = settings;

		return (
			<CollapsableFormBox title="Показатель">
				<FormField>
					<FormCheckControl label="Показать ось">
						<Checkbox checked={show} name={FIELDS.show} onChange={this.handleChangeSettings} value={show} />
					</FormCheckControl>
				</FormField>
				<FormField>
					<FormCheckControl label="Выводить название">
						<Checkbox checked={showName} name={FIELDS.showName} onChange={this.handleChangeSettings} value={showName} />
					</FormCheckControl>
				</FormField>
				<FormField small>
					<TextInput maxLength={MAX_TEXT_LENGTH} name={axisFieldName} onChange={onChangeAxisName} value={axisName} />
				</FormField>
			</CollapsableFormBox>
		);
	}
}

export default AxisSettingsBox;
