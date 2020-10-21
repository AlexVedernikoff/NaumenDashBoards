// @flow
import {Checkbox, TextInput} from 'components/atoms';
import {FIELDS, MAX_TEXT_LENGTH} from 'components/organisms/WidgetFormPanel/constants';
import {FormCheckControl, FormField, ToggableFormBox} from 'components/molecules';
import type {OnChangeInputEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {withStyleFormBuilder} from 'WidgetFormPanel/builders';

export class IndicatorBox extends PureComponent<Props> {
	handleChangeTickAmount = (event: OnChangeInputEvent) => {
		const {handleChange} = this.props;
		const {value} = event;

		if (value.toString().length < 3) {
			handleChange(event);
		}
	};

	render () {
		const {data, handleBoolChange, handleChange} = this.props;
		const {name, show, showName} = data;

		return (
			<ToggableFormBox name={FIELDS.show} onToggle={handleBoolChange} showContent={show} title="Показатель">
				<FormField>
					<FormCheckControl label="Выводить название">
						<Checkbox checked={showName} name={FIELDS.showName} onChange={handleBoolChange} value={showName} />
					</FormCheckControl>
				</FormField>
				<FormField small>
					<TextInput maxLength={MAX_TEXT_LENGTH} name={FIELDS.name} onChange={handleChange} value={name} />
				</FormField>
			</ToggableFormBox>
		);
	}
}

export default withStyleFormBuilder(IndicatorBox);
