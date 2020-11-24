// @flow
import {Checkbox, TextInput} from 'components/atoms';
import {CollapsableFormBox, FormCheckControl, FormField} from 'components/molecules';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import {MAX_TEXT_LENGTH} from 'components/constants';
import type {OnChangeInputEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {withStyleFormBuilder} from 'DiagramWidgetEditForm/builders';

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
			<CollapsableFormBox title="Показатель">
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
				<FormField small>
					<TextInput maxLength={MAX_TEXT_LENGTH} name={FIELDS.name} onChange={handleChange} value={name} />
				</FormField>
			</CollapsableFormBox>
		);
	}
}

export default withStyleFormBuilder(IndicatorBox);
