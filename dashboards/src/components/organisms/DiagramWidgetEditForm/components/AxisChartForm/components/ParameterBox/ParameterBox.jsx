// @flow
import {Checkbox, TextInput} from 'components/atoms';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import {FormCheckControl, FormField, ToggableFormBox} from 'components/molecules';
import {MAX_TEXT_LENGTH} from 'components/constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {withStyleFormBuilder} from 'DiagramWidgetEditForm/builders';

export class ParameterBox extends PureComponent<Props> {
	render () {
		const {data, handleBoolChange, handleChange} = this.props;
		const {
			name,
			show = true,
			showName = false
		} = data;

		return (
			<ToggableFormBox name={FIELDS.show} onToggle={handleBoolChange} showContent={show} title="Параметр">
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