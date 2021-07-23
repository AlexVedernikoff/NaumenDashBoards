// @flow
import FormBox from 'components/molecules/FormBox';
import FormField from 'components/molecules/FormField';
import type {InjectedProps} from 'WidgetFormPanel/HOCs/withType/types';
import OuterSelect from 'components/molecules/OuterSelect';
import React, {PureComponent} from 'react';
import {WIDGET_OPTIONS} from './constants';
import withType from 'WidgetFormPanel/HOCs/withType';

export class WidgetSelectBox extends PureComponent<InjectedProps> {
	handleChange = (name: string, value: string) => this.props.type.onChange(value);

	render () {
		const {value} = this.props.type;

		return (
			<FormBox>
				<FormField label="Тип диаграммы">
					<OuterSelect onSelect={this.handleChange} options={WIDGET_OPTIONS} value={value} />
				</FormField>
			</FormBox>
		);
	}
}

export default withType(WidgetSelectBox);
