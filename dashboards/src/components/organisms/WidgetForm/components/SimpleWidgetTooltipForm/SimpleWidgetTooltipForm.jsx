// @flow
import {DEFAULT_TOOLTIP_SETTINGS} from 'store/widgets/data/constants';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FontFamilySelect from 'WidgetFormPanel/components/FontFamilySelect';
import FontSizeSelect from 'WidgetFormPanel/components/FontSizeSelect';
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

	renderFontEditor = () => {
		const {fontFamily = DEFAULT_TOOLTIP_SETTINGS.fontFamily, fontSize = DEFAULT_TOOLTIP_SETTINGS.fontSize} = this.props.value;
		return (
			<FormField row>
				<FontFamilySelect name={DIAGRAM_FIELDS.fontFamily} onSelect={this.handleChange} value={fontFamily} />
				<FontSizeSelect name={DIAGRAM_FIELDS.fontSize} onSelect={this.handleChange} value={fontSize} />
			</FormField>
		);
	};

	renderTitleEditor = () => {
		const {text} = this.props.value;
		return (
			<FormField label={t('WidgetForm::SimpleWidgetTooltipForm::TooltipAtTitle')}>
				<TextArea focusOnMount={true} maxLength={1000} name={DIAGRAM_FIELDS.text} onChange={this.handleChange} value={text} />
			</FormField>

		);
	};

	render () {
		const {show} = this.props.value;
		return (
			<ToggableFormBox name={DIAGRAM_FIELDS.show} onToggle={this.handleShow} showContent={show} title={t('WidgetForm::SimpleWidgetTooltipForm::Tooltip')}>
				{this.renderTitleEditor()}
				{this.renderFontEditor()}
			</ToggableFormBox>
		);
	}
}

export default SimpleWidgetTooltipForm;
