// @flow
import CheckIconButtonGroup from 'components/molecules/CheckIconButtonGroup';
import ColorInput from 'components/molecules/ColorInput';
import {DEFAULT_TEXT_WIDGET_SETTINGS, TEXT_FIELDS} from 'components/organisms/TextWidgetForm/constants';
import {EditorState, Modifier, RichUtils} from 'draft-js';
import FontFamilySelect from 'WidgetFormPanel/components/FontFamilySelect';
import {FONT_SIZE_OPTIONS} from './constants';
import FontSizeSelect from 'WidgetFormPanel/components/FontSizeSelect';
import {FONT_STYLES} from 'store/widgets/data/constants';
import FormBox from 'components/molecules/FormBox';
import FormField from 'components/molecules/FormField';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {OnChangeEvent, OnChangeInputEvent, OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import t from 'localization';
import TextAlignControl from 'WidgetFormPanel/components/TextAlignControl';

export class StyleBox extends PureComponent<Props> {
	addStyleToMap = (name: string, value: string | number) => {
		const {onChangeTextSettings, textSettings} = this.props;
		const {styleMap} = textSettings;
		const styleName = this.getStyleName(name, value);

		if (!(styleName in styleMap)) {
			textSettings[TEXT_FIELDS.styleMap] = {
				...textSettings[TEXT_FIELDS.styleMap],
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
				.reduce((contentState, styleName) => Modifier.removeInlineStyle(contentState, selection, styleName), editorState.getCurrentContent());

			const nextEditorState = EditorState.push(
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

		this.changeEditorStyle(name, (value ?? '').toString());
	};

	handleChangeFontStyle = (e: OnChangeInputEvent) => {
		const {onChangeEditorState} = this.props;
		const {value} = e;

		onChangeEditorState(RichUtils.toggleInlineStyle(this.getEditorState(), (value ?? '').toString()));
	};

	handleChangeTextAlign = ({name, value}: OnChangeEvent<string>) => {
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
		const options = [
			{
				active: currentStyle.has(FONT_STYLES.BOLD),
				name: ICON_NAMES.BOLD,
				title: t('TextWidgetForm::StyleBox::Bold'),
				value: FONT_STYLES.BOLD
			},
			{
				active: currentStyle.has(FONT_STYLES.ITALIC),
				name: ICON_NAMES.ITALIC,
				title: t('TextWidgetForm::StyleBox::Italic'),
				value: FONT_STYLES.ITALIC
			},
			{
				active: currentStyle.has(FONT_STYLES.UNDERLINE),
				name: ICON_NAMES.UNDERLINE,
				title: t('TextWidgetForm::StyleBox::Underline'),
				value: FONT_STYLES.UNDERLINE
			}
		];

		return <CheckIconButtonGroup name={TEXT_FIELDS.fontStyle} onChange={this.handleChangeFontStyle} options={options} />;
	};

	render () {
		const {textAlign} = this.props.textSettings;
		const {color, fontFamily, fontSize} = DEFAULT_TEXT_WIDGET_SETTINGS;

		return (
			<FormBox className={styles.box}>
				<FormField label={t('TextWidgetForm::StyleBox::Font')} row>
					<FontFamilySelect
						name={TEXT_FIELDS.fontFamily}
						onSelect={this.handleSelectStyle}
						value={this.getEditorValue(TEXT_FIELDS.fontFamily, fontFamily)}
					/>
					<FontSizeSelect
						editable={false}
						name={TEXT_FIELDS.fontSize}
						onSelect={this.handleSelectStyle}
						options={FONT_SIZE_OPTIONS}
						value={this.getEditorValue(TEXT_FIELDS.fontSize, fontSize)}
					/>
				</FormField>
				<FormField row>
					{this.renderFontStyleButtons()}
					<ColorInput
						name={TEXT_FIELDS.color}
						onChange={this.handleChangeColor}
						portable={true}
						value={this.getEditorValue(TEXT_FIELDS.color, color)}
					/>
				</FormField>
				<FormField row>
					<TextAlignControl name={TEXT_FIELDS.textAlign} onChange={this.handleChangeTextAlign} value={textAlign} />
				</FormField>
			</FormBox>
		);
	}
}

export default StyleBox;
