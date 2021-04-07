// @flow
import Checkbox from 'components/atoms/Checkbox';
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FormCheckControl from 'components/molecules/FormCheckControl';
import FormField from 'components/molecules/FormField';
import type {OnChangeEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class AxisSettingsBox extends PureComponent<Props> {
	handleChangeSettings = ({name: key, value}: OnChangeEvent<boolean>) => {
		const {name, onChange, value: settings} = this.props;

		onChange(name, {...settings, [key]: !value});
	};

	render () {
		const {children, title, value} = this.props;
		const {show, showName} = value;

		return (
			<CollapsableFormBox title={title}>
				<FormField>
					<FormCheckControl label="Показать ось">
						<Checkbox checked={show} name={DIAGRAM_FIELDS.show} onChange={this.handleChangeSettings} value={show} />
					</FormCheckControl>
				</FormField>
				<FormField>
					<FormCheckControl label="Выводить название">
						<Checkbox checked={showName} name={DIAGRAM_FIELDS.showName} onChange={this.handleChangeSettings} value={showName} />
					</FormCheckControl>
				</FormField>
				{children}
			</CollapsableFormBox>
		);
	}
}

export default AxisSettingsBox;
