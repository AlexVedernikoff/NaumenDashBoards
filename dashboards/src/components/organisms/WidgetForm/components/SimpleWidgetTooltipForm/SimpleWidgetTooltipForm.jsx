// @flow
import {DEFAULT_TOOLTIP_SETTINGS} from 'store/widgets/data/constants';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FormField from 'components/molecules/FormField';
import type {OnChangeEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import t from 'localization';
import TextArea from 'components/atoms/TextArea';
import ToggableFormBox from 'components/molecules/ToggableFormBox';

class SimpleWidgetTooltipForm extends PureComponent<Props> {
	static defaultProps = {
		canIndicators: false,
		value: DEFAULT_TOOLTIP_SETTINGS
	};

	handleChange = ({name: key, value: change}: OnChangeEvent<string>) => {
		const {name, onChange, value} = this.props;
		return onChange(name, {
			...value,
			[key]: change
		});
	};

	handleShow = ({value: change}: OnChangeEvent<boolean>) => {
		const {name, onChange, value} = this.props;
		return onChange(name, {
			...value,
			show: !change
		});
	};

	render () {
		const {show, title} = this.props.value;
		return (
			<ToggableFormBox name={DIAGRAM_FIELDS.show} onToggle={this.handleShow} showContent={show} title={t('WidgetForm::SimpleWidgetTooltipForm::Tooltip')}>
				<FormField label={t('WidgetForm::SimpleWidgetTooltipForm::TooltipAtTitle')}>
					<TextArea focusOnMount={true} maxLength={1000} name={DIAGRAM_FIELDS.title} onChange={this.handleChange} value={title} />
				</FormField>
			</ToggableFormBox>
		);
	}
}

export default SimpleWidgetTooltipForm;
