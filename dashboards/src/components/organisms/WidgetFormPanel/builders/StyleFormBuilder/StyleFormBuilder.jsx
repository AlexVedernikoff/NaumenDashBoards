// @flow
import {CheckIconButtonGroup, ColorInput, Select} from 'components/molecules';
import {FIELDS} from 'WidgetFormPanel/constants';
import {
	FONT_FAMILIES,
	FONT_SIZE_OPTIONS,
	FONT_STYLES,
	SORTING_TYPES,
	TEXT_ALIGNS,
	TEXT_HANDLERS
} from 'store/widgets/data/constants';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {InputProps, OnChangeEvent, Props} from './types';
import type {OnChangeInputEvent} from 'components/types';
import React, {Component} from 'react';
import styles from './styles.less';

export class StyleFormBuilder extends Component<Props> {
	handleBoolChange = (event: OnChangeInputEvent) => {
		const {data, name, onChange} = this.props;
		const {name: key, value} = event;

		onChange(name, {
			...data,
			[key]: !value
		});
	};

	handleChange = (event: OnChangeEvent) => {
		const {data, name, onChange} = this.props;
		const {name: key, value} = event;

		onChange(name, {
			...data,
			[key]: value
		});
	};

	handleChangeFontSize = (event: OnChangeInputEvent) => {
		const {name, value} = event;

		if (/^(\d+)?$/.test(value.toString())) {
			this.handleChange({name, value});
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

	renderFontFamilySelect = () => {
		const {[FIELDS.fontFamily]: value} = this.props.data;

		return (
			<Select
				className={styles.fontFamily}
				name={FIELDS.fontFamily}
				onSelect={this.handleChange}
				options={FONT_FAMILIES}
				value={value}
			/>
		);
	};

	renderFontSizeSelect = () => {
		const {[FIELDS.fontSize]: value} = this.props.data;

		return (
			<Select
				className={styles.fontSize}
				editable={true}
				name={FIELDS.fontSize}
				onChangeLabel={this.handleChangeFontSize}
				onSelect={this.handleChange}
				options={FONT_SIZE_OPTIONS}
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

	renderSortingButtons = () => {
		const {type} = this.props.data;
		const icons = [
			{
				name: ICON_NAMES.DESC,
				title: 'По убыванию',
				value: SORTING_TYPES.DESC
			},
			{
				name: ICON_NAMES.ASC,
				title: 'По возрастанию',
				value: SORTING_TYPES.ASC
			}
		];

		return <CheckIconButtonGroup icons={icons} name={FIELDS.type} onChange={this.handleChange} value={type} />;
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
			renderSortingButtons: this.renderSortingButtons,
			renderTextAlignButtons: this.renderTextAlignButtons,
			renderTextHandlerButtons: this.renderTextHandlerButtons
		});
	}
}

export default StyleFormBuilder;
