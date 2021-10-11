// @flow
import {compose} from 'redux';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FormBox from 'components/molecules/FormBox';
import FormField from 'components/molecules/FormField';
import NewWidget from 'store/widgets/data/NewWidget';
import OuterSelect from 'components/molecules/OuterSelect';
import type {Props} from 'WidgetFormPanel/HOCs/withType/types';
import React, {PureComponent} from 'react';
import {WIDGET_OPTIONS} from './constants';
import {WIDGET_TYPES} from 'store/widgets/data/constants';
import withType from 'WidgetFormPanel/HOCs/withType';
import withValues from 'components/organisms/WidgetForm/HOCs/withValues';
import withWidget from 'WidgetFormPanel/HOCs/withWidget';

export class WidgetSelectBox extends PureComponent<Props> {
	handleChange = (name: string, value: string) => {
		this.props.type.onChange(value, () => {
			const {setFieldValue, values: {legend}, widget: {id}} = this.props;
			const {BAR, COLUMN, LINE} = WIDGET_TYPES;
			const targetTypes = [BAR, COLUMN, LINE];

			if (id === NewWidget.id && value) {
				const show = !targetTypes.includes(value);

				setFieldValue(DIAGRAM_FIELDS.legend, {...legend, show});
			}
		});
	};

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

export default compose(withValues(DIAGRAM_FIELDS.legend), withWidget, withType)(WidgetSelectBox);
