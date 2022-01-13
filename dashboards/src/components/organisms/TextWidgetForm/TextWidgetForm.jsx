// @flow
import {COMMAND_EVENTS} from 'components/atoms/TextEditor/constants';
import {DISPLAY_MODE_OPTIONS} from 'store/widgets/constants';
import type {EditorState, OnChangeEvent} from 'components/atoms/TextEditor/types';
import {FONT_STYLES} from 'store/widgets/data/constants';
import FormBox from 'components/molecules/FormBox';
import FormField from 'components/molecules/FormField';
import {getDefaultKeyBinding, KeyBindingUtil, RichUtils} from 'draft-js';
import {HOT_KEYS, HOT_KEYS_COMMANDS, TEXT_FIELDS} from './constants';
import type {OnSelectEvent, Ref} from 'components/types';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import Select from 'components/molecules/Select';
import StyleBox from './components/StyleBox';
import styles from './styles.less';
import t from 'localization';
import TextEditor from 'components/atoms/TextEditor';
import type {TextSettings} from 'store/widgets/data/types';
import WidgetForm from 'components/templates/WidgetForm';

export class TextWidgetForm extends PureComponent<Props> {
	editorRef: Ref<typeof TextEditor> = createRef();

	focusOnTextEditor = () => {
		const {current: editor} = this.editorRef;

		editor && editor.focusEditor();
	};

	handleChangeDisplayMode = ({value}: OnSelectEvent) => {
		const {setFieldValue} = this.props;
		const {value: modeValue} = value;

		setFieldValue(TEXT_FIELDS.displayMode, modeValue);
	};

	handleChangeEditorStateByStyle = (editorState: EditorState) => {
		this.updateEditorState(editorState, this.focusOnTextEditor);
	};

	handleChangeTextEditor = ({value}: OnChangeEvent) => this.updateEditorState(value);

	handleChangeTextSettings = (textSettings: TextSettings) => this.props.setFieldValue(TEXT_FIELDS.textSettings, textSettings);

	handleKeyCommand = (command: string, editorState: EditorState): string => {
		const {COMMAND_HANDLED_EVENT, COMMAND_NOT_HANDLED_EVENT} = COMMAND_EVENTS;
		const {TOGGLE_BOLD_STYLE, TOGGLE_ITALIC_STYLE, TOGGLE_UNDERLINE_STYLE} = HOT_KEYS_COMMANDS;

		switch (command) {
			case TOGGLE_BOLD_STYLE:
				this.updateEditorState(RichUtils.toggleInlineStyle(
					editorState,
					FONT_STYLES.BOLD
				));
				return COMMAND_HANDLED_EVENT;
			case TOGGLE_ITALIC_STYLE:
				this.updateEditorState(RichUtils.toggleInlineStyle(
					editorState,
					FONT_STYLES.ITALIC
				));
				return COMMAND_HANDLED_EVENT;
			case TOGGLE_UNDERLINE_STYLE:
				this.updateEditorState(RichUtils.toggleInlineStyle(
					editorState,
					FONT_STYLES.UNDERLINE
				));
				return COMMAND_HANDLED_EVENT;
		}

		return COMMAND_NOT_HANDLED_EVENT;
	};

	keyBindingFn = (e: SyntheticKeyboardEvent<HTMLElement>): ?string => {
		const {hasCommandModifier} = KeyBindingUtil;
		const commandModifierPressed = hasCommandModifier(e);

		if (commandModifierPressed) {
			const {BOLD_KEY, ITALIC_KEY, UNDERLINE_KEY} = HOT_KEYS;
			const {TOGGLE_BOLD_STYLE, TOGGLE_ITALIC_STYLE, TOGGLE_UNDERLINE_STYLE} = HOT_KEYS_COMMANDS;

			switch (e.keyCode) {
				case BOLD_KEY:
					return TOGGLE_BOLD_STYLE;
				case ITALIC_KEY:
					return TOGGLE_ITALIC_STYLE;
				case UNDERLINE_KEY:
					return TOGGLE_UNDERLINE_STYLE;
			}
		}

		return getDefaultKeyBinding(e);
	};

	updateEditorState = (editorState: EditorState, callback?: Function) => {
		const {setFieldValue} = this.props;

		setFieldValue(TEXT_FIELDS.editorState, editorState, callback);
	};

	renderDisplayModeSelect = () => {
		const {displayMode} = this.props.values;
		const value = DISPLAY_MODE_OPTIONS.find(item => item.value === displayMode) || DISPLAY_MODE_OPTIONS[0];

		return (
			<FormBox title={t('TextWidgetForm::DisplayMode')}>
				<FormField>
					<Select
						getOptionLabel={option => t(option.label)}
						name={TEXT_FIELDS.displayMode}
						onSelect={this.handleChangeDisplayMode}
						options={DISPLAY_MODE_OPTIONS}
						placeholder={t('TextWidgetForm::DisplayModePlaceholder')}
						value={value}
					/>
				</FormField>
			</FormBox>
		);
	};

	renderStyleBox = () => {
		const {editorState, textSettings} = this.props.values;

		if (editorState) {
			return (
				<StyleBox
					editorState={editorState}
					onChangeEditorState={this.handleChangeEditorStateByStyle}
					onChangeTextSettings={this.handleChangeTextSettings}
					textSettings={textSettings}
				/>
			);
		}

		return null;
	};

	renderTextEditor = () => {
		const {editorState, textSettings} = this.props.values;
		const {content, styleMap, textAlign} = textSettings;

		return (
			<FormBox>
				<FormField>
					<TextEditor
						className={styles.textEditor}
						content={content}
						handleKeyCommand={this.handleKeyCommand}
						keyBindingFn={this.keyBindingFn}
						name={TEXT_FIELDS.editorState}
						onChange={this.handleChangeTextEditor}
						ref={this.editorRef}
						styleMap={styleMap}
						textAlign={textAlign}
						value={editorState}
					/>
				</FormField>
			</FormBox>
		);
	};

	render () {
		const {handleCancel, handleSubmit, submitting} = this.props;

		return (
			<WidgetForm
				onCancel={handleCancel}
				onSubmit={handleSubmit}
				title={t('TextWidgetForm::Text')}
				updating={submitting}
			>
				{this.renderTextEditor()}
				{this.renderStyleBox()}
				{this.renderDisplayModeSelect()}
			</WidgetForm>
		);
	}
}

export default TextWidgetForm;
