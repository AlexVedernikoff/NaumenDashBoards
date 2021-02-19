// @flow
import CheckIconButtonGroup from 'components/molecules/CheckIconButtonGroup';
import ColorInput from 'components/molecules/ColorInput';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import {
	FONT_FAMILIES,
	FONT_SIZE_AUTO_OPTION,
	FONT_SIZE_OPTIONS,
	FONT_STYLES,
	MAX_FONT_SIZE,
	TEXT_ALIGNS,
	TEXT_HANDLERS
} from 'store/widgets/data/constants';
import type {FontSizeSelectProps, InputProps, OnChangeEvent, Props, SelectProps} from './types';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {OnChangeInputEvent} from 'components/types';
import React, {Component} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';

export class StyleFormBuilder extends Component<Props> {
	handleBoolChange = (event: OnChangeInputEvent) => {
		const {onChange} = this.props;
		const {name, value} = event;

		onChange(name, !value);
	};

	handleChange = (event: OnChangeEvent) => {
		const {onChange} = this.props;
		const {name, value} = event;

		onChange(name, value);
	};

	handleChangeFontSize = (onSelect: Function) => (event: OnChangeInputEvent) => {
		let {name, value} = event;

		if (/^(\d+)?$/.test(value.toString())) {
			if (Number(value) > MAX_FONT_SIZE) {
				value = MAX_FONT_SIZE;
			}

			onSelect({name, value: Number(value)});
		}
	};

	handleConditionChange = (event: OnChangeInputEvent) => {
		const {data} = this.props;
		let {name, value} = event;

		if (data[name] === value) {
			value = '';
		}

		this.handleChange({name, value});
	};

	renderColorInput = (props: $Shape<InputProps> = {}) => {
		const {data} = this.props;
		const {
			name = FIELDS.fontColor,
			onChange = this.handleChange,
			value = data[FIELDS.fontColor]
		} = props;

		return (
			<ColorInput
				name={name}
				onChange={onChange}
				portable={true}
				value={value}
			/>
		);
	};

	renderFontFamilySelect = (props: $Shape<SelectProps> = {}) => {
		const {
			name = FIELDS.fontFamily,
			onSelect = this.handleChange,
			value = this.props.data[FIELDS.fontFamily]
		} = props;

		return (
			<Select
				className={styles.fontFamilySelect}
				name={name}
				onSelect={onSelect}
				options={FONT_FAMILIES}
				value={value}
			/>
		);
	};

	renderFontSizeSelect = (props: $Shape<FontSizeSelectProps> = {}) => {
		const {
			editable = true,
			name = FIELDS.fontSize,
			onSelect = this.handleChange,
			options = FONT_SIZE_OPTIONS,
			usesAuto = false,
			value = this.props.data[FIELDS.fontSize]
		} = props;
		const selectOptions = usesAuto ? [FONT_SIZE_AUTO_OPTION, ...options] : options;

		return (
			<Select
				className={styles.fontSizeSelect}
				editable={editable}
				name={name}
				onChangeLabel={this.handleChangeFontSize(onSelect)}
				onSelect={onSelect}
				options={selectOptions}
				value={value}
			/>
		);
	};

	renderFontStyleButtons = (props: $Shape<InputProps> = {}) => {
		const {data} = this.props;
		const {
			name = FIELDS.fontStyle,
			onChange = this.handleConditionChange,
			value = data[FIELDS.fontStyle]
		} = props;
		const icons = [
			{
				name: ICON_NAMES.BOLD,
				title: 'Жирный',
				value: FONT_STYLES.BOLD
			},
			{
				name: ICON_NAMES.ITALIC,
				title: 'Курсив',
				value: FONT_STYLES.ITALIC
			},
			{
				name: ICON_NAMES.UNDERLINE,
				title: 'Подчеркнутый',
				value: FONT_STYLES.UNDERLINE
			}
		];

		return <CheckIconButtonGroup icons={icons} name={name} onChange={onChange} value={value} />;
	};

	renderTextAlignButtons = (props: $Shape<InputProps> = {}) => {
		const {data} = this.props;
		const {
			name = FIELDS.textAlign,
			onChange = this.handleChange,
			value = data[FIELDS.textAlign]
		} = props;
		const icons = [
			{
				name: ICON_NAMES.ALIGN_LEFT,
				title: 'По левому краю',
				value: TEXT_ALIGNS.left
			},
			{
				name: ICON_NAMES.ALIGN_CENTER,
				title: 'По центру',
				value: TEXT_ALIGNS.center
			},
			{
				name: ICON_NAMES.ALIGN_RIGHT,
				title: 'По правому краю',
				value: TEXT_ALIGNS.right
			}
		];

		return <CheckIconButtonGroup icons={icons} name={name} onChange={onChange} value={value} />;
	};

	renderTextHandlerButtons = (props: $Shape<InputProps> = {}) => {
		const {data} = this.props;
		const {
			name = FIELDS.textHandler,
			onChange = this.handleChange,
			value = data[FIELDS.textHandler]
		} = props;
		const icons = [
			{
				name: ICON_NAMES.CROP,
				title: 'Обрезать текст',
				value: TEXT_HANDLERS.CROP
			},
			{
				name: ICON_NAMES.WRAP,
				title: 'Переносить по словам',
				value: TEXT_HANDLERS.WRAP
			}
		];

		return <CheckIconButtonGroup icons={icons} name={name} onChange={onChange} value={value} />;
	};

	render () {
		return this.props.render({
			handleBoolChange: this.handleBoolChange,
			handleChange: this.handleChange,
			handleConditionChange: this.handleConditionChange,
			renderColorInput: this.renderColorInput,
			renderFontFamilySelect: this.renderFontFamilySelect,
			renderFontSizeSelect: this.renderFontSizeSelect,
			renderFontStyleButtons: this.renderFontStyleButtons,
			renderTextAlignButtons: this.renderTextAlignButtons,
			renderTextHandlerButtons: this.renderTextHandlerButtons
		});
	}
}

export default StyleFormBuilder;
