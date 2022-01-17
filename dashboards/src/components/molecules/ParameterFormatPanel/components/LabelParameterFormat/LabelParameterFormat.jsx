// @flow
import {AXIS_FORMAT_TYPE, LABEL_FORMATS} from 'store/widgets/data/constants';
import FormField from 'components/molecules/FormField';
import {LABEL_FORMAT_FIELDS} from 'components/organisms/WidgetFormPanel/constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import Select from 'components/molecules/Select';
import {STATE_FORMAT_OPTIONS} from './constants';
import t from 'localization';

export class LabelParameterFormat extends PureComponent<Props> {
	handleChange = ({value}) => {
		const {onChange} = this.props;

		onChange({
			labelFormat: value?.value ?? LABEL_FORMATS.TITLE,
			type: AXIS_FORMAT_TYPE.LABEL_FORMAT
		});
	};

	render () {
		const {label, value} = this.props;
		const options = STATE_FORMAT_OPTIONS.map(({label, value}) => ({label: t(label), value}));
		const labelFormat = value && value.type === AXIS_FORMAT_TYPE.LABEL_FORMAT ? value.labelFormat : LABEL_FORMATS.TITLE;
		const selectedItem = options.find(item => item.value === labelFormat);
		const fieldLabel = label ? t('LabelParameterFormat::FieldLabel', {label}) : '';

		return (
			<FormField label={fieldLabel} small>
				<Select
					name={LABEL_FORMAT_FIELDS.labelFormat}
					onSelect={this.handleChange}
					options={options}
					value={selectedItem}
				/>
			</FormField>
		);
	}
}
