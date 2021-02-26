// @flow
import CheckIconButtonGroup from 'components/molecules/CheckIconButtonGroup';
import {DEFAULT_TEXT_WIDGET_SETTINGS, FIELDS} from 'components/organisms/TextWidgetEditForm/constants';
import {EditorState, Modifier, RichUtils} from 'draft-js';
import {FONT_SIZE_OPTIONS} from './constants';
import {FONT_STYLES} from 'store/widgets/data/constants';
import FormBox from 'components/molecules/FormBox';
import FormField from 'components/molecules/FormField';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {OnChangeInputEvent, OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import type {StyleBuilderProps} from 'DiagramWidgetEditForm/builders/StyleFormBuilder/types';
import StyleFormBuilder from 'DiagramWidgetEditForm/builders/StyleFormBuilder/StyleFormBuilder';
import styles from './styles.less';

export class StyleBox extends PureComponent<Props> {
	addStyleToMap = (name: string, value: string | number) => {
		const {onChangeTextSettings, textSettings} = this.props;
		const {styleMap} = textSettings;
		const styleName = this.getStyleName(name, value);

		if (!(styleName in styleMap)) {
			textSettings[FIELDS.styleMap] = {
				...textSettings[FIELDS.styleMap],
				[styleName]: {
					[name]: value
				}
			};

			onChangeTextSettings(textSettings);
		}
	};

	changeEditorStyle = (name: string, value: string | number) => {
		const {onChangeEditorState, textSettings} = this.props;
		const editorState = this.getEditorState();
		const styleName = this.getStyleName(name, value);
		const currentStyle = editorState.getCurrentInlineStyle();

		if (!currentStyle.has(styleName)) {
			this.addStyleToMap(name, value);

			const selection = editorState.getSelection();
			// Удаляем аналогичные стили у всех вложенных блоков
			const nextContentState = Object.keys(textSettings.styleMap).filter(styleName => styleName.startsWith(name))
				.reduce((contentState, styleName) => {
					return Modifier.removeInlineStyle(contentState, selection, styleName);
				}, editorState.getCurrentContent());

			let nextEditorState = EditorState.push(
				editorState,
				nextContentState,
				'change-inline-style'
			);

			onChangeEditorState(RichUtils.toggleInlineStyle(
				nextEditorState,
				styleName
			));
		}
	};

	getEditorState = () => {
		let {editorState} = this.props;

		const currentContent = editorState.getCurrentContent();
		let selection = editorState.getSelection();

		if (selection.isCollapsed()) {
			selection = selection.merge({
				anchorKey: currentContent.getFirstBlock().getKey(),
				anchorOffset: 0,
				focusKey: currentContent.getLastBlock().getKey(),
				focusOffset: currentContent.getLastBlock().getText().length
			});

			editorState = EditorState.acceptSelection(editorState, selection);
		}

		return editorState;
	};

	getEditorValue = <T>(baseStyleName: string, defaultValue: T): T => {
		const {styleMap} = this.props.textSettings;
		const currentStyle = this.props.editorState.getCurrentInlineStyle();
		const styleName = Object.keys(styleMap)
			.find(name => currentStyle.has(name) && name.startsWith(baseStyleName));

		return styleName ? styleMap[styleName][baseStyleName] : defaultValue;
	};

	getStyleName = (name: string, value: string | number): string => `${name}_${value.toString()}`;

	handleChangeColor = (e: OnChangeInputEvent) => {
		const {name, value} = e;

		this.changeEditorStyle(name, value.toString());
	};

	handleChangeFontStyle = (e: OnChangeInputEvent) => {
		const {onChangeEditorState} = this.props;
		const {value} = e;

		onChangeEditorState(RichUtils.toggleInlineStyle(this.getEditorState(), value));
	};

	handleChangeTextSettings = (name: string, value: any) => {
		const {onChangeTextSettings, textSettings} = this.props;

		onChangeTextSettings({
			...textSettings,
			[name]: value
		});
	};

	handleSelectStyle = (e: OnSelectEvent) => {
		const {name, value} = e;

		this.changeEditorStyle(name, value);
	};

	renderFontStyleButtons = () => {
		const currentStyle = this.props.editorState.getCurrentInlineStyle();

		const icons = [
			{
				active: currentStyle.has(FONT_STYLES.BOLD),
				name: ICON_NAMES.BOLD,
				title: 'Жирный',
				value: FONT_STYLES.BOLD
			},
			{
				active: currentStyle.has(FONT_STYLES.ITALIC),
				name: ICON_NAMES.ITALIC,
				title: 'Курсив',
				value: FONT_STYLES.ITALIC
			},
			{
				active: currentStyle.has(FONT_STYLES.UNDERLINE),
				name: ICON_NAMES.UNDERLINE,
				title: 'Подчеркнутый',
				value: FONT_STYLES.UNDERLINE
			}
		];

		return <CheckIconButtonGroup icons={icons} name={FIELDS.fontStyle} onChange={this.handleChangeFontStyle} />;
	};

	renderStyleBox = (props: StyleBuilderProps) => {
		const {color, fontFamily, fontSize} = DEFAULT_TEXT_WIDGET_SETTINGS;
		const {
			renderColorInput,
			renderFontFamilySelect,
			renderFontSizeSelect,
			renderTextAlignButtons
		} = props;
		const fontFamilySelectProps = {
			onSelect: this.handleSelectStyle,
			value: this.getEditorValue(FIELDS.fontFamily, fontFamily)
		};
		const fonsSizeSelectProps = {
			editable: false,
			onSelect: this.handleSelectStyle,
			options: FONT_SIZE_OPTIONS,
			value: this.getEditorValue(FIELDS.fontSize, fontSize)
		};
		const colorInputProps = {
			name: FIELDS.color,
			onChange: this.handleChangeColor,
			value: this.getEditorValue(FIELDS.color, color)
		};

		return (
			<FormBox className={styles.box}>
				<FormField label="Шрифт" row>
					{renderFontFamilySelect(fontFamilySelectProps)}
					{renderFontSizeSelect(fonsSizeSelectProps)}
				</FormField>
				<FormField row>
					{this.renderFontStyleButtons()}
					{renderColorInput(colorInputProps)}
				</FormField>
				<FormField row>
					{renderTextAlignButtons()}
				</FormField>
			</FormBox>
		);
	};

	render () {
		const {textSettings} = this.props;

		return (
			<StyleFormBuilder data={textSettings} onChange={this.handleChangeTextSettings} render={this.renderStyleBox} />
		);
	}
}

export default StyleBox;
