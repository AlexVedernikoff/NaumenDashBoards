// @flow
import {Checkbox, TextInput} from 'components/atoms';
import {FIELDS, MAX_TEXT_LENGTH} from 'WidgetFormPanel/constants';
import {FormCheckControl, FormField, ToggableFormBox} from 'components/molecules';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {withStyleFormBuilder} from 'WidgetFormPanel/builders';

export class ParameterBox extends PureComponent<Props> {
	render () {
		const {data, handleBoolChange, handleChange} = this.props;
		const {
			name,
			show = true,
			showName = false
		} = data;

		return (
			<ToggableFormBox title="Параметр">
				<FormField>
					<FormCheckControl label="Показать ось">
						<Checkbox checked={show} name={FIELDS.show} onChange={handleBoolChange} value={show} />
					</FormCheckControl>
				</FormField>
				<FormField>
					<FormCheckControl label="Выводить название">
						<Checkbox checked={showName} name={FIELDS.showName} onChange={handleBoolChange} value={showName} />
					</FormCheckControl>
				</FormField>
				<FormField small={true}>
					<TextInput maxLength={MAX_TEXT_LENGTH} name={FIELDS.name} onChange={handleChange} value={name} />
				</FormField>
			</ToggableFormBox>
		);
	}
}

export default withStyleFormBuilder(ParameterBox);
