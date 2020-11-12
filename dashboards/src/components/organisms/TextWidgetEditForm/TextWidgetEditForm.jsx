// @flow
import {COMMAND_EVENTS, FIELDS, HOT_KEYS, HOT_KEYS_COMMANDS} from './constants';
import {convertToRaw, getDefaultKeyBinding, KeyBindingUtil, RichUtils} from 'draft-js';
import type {EditorState, OnChangeEvent} from 'components/atoms/TextEditor/types';
import {FONT_STYLES, WIDGET_TYPES} from 'store/widgets/data/constants';
import {FormBox, FormField} from 'components/molecules';
import type {InjectedProps as Props, Values} from 'containers/WidgetEditForm/types';
import React, {PureComponent} from 'react';
import {StyleBox} from './components';
import styles from './styles.less';
import {TextEditor} from 'components/atoms';
import type {TextSettings, TextWidget, Widget} from 'store/widgets/data/types';
import {WidgetForm} from 'components/templates';

export class TextWidgetEditForm extends PureComponent<Props> {
	getEditorText = (): string => {
		const {editorState} = this.props.values;
		const content = convertToRaw(editorState.getCurrentContent());

		return content.blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
	};

	handleChangeTextEditor = ({value}: OnChangeEvent) => this.updateEditorState(value);

	handleChangeTextSettings = (textSettings: TextSettings) => this.props.setFieldValue(FIELDS.textSettings, textSettings);

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

	handleSubmit = () => {
		const {onSubmit} = this.props;
		onSubmit(this.updateWidget);
	};

	keyBindingFn = (e: SyntheticKeyboardEvent<HTMLElement>): string | null => {
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

	updateEditorState = (editorState: EditorState) => this.props.setFieldValue(FIELDS.editorState, editorState);

	updateWidget = (widget: Widget, values: Values): TextWidget => {
		const {id} = widget;
		const {
			displayMode,
			editorState,
			textSettings
		} = values;
		const content = convertToRaw(editorState.getCurrentContent());
		const text = this.getEditorText();

		return {
			displayMode,
			id,
			text,
			textSettings: {
				...textSettings,
				content
			},
			type: WIDGET_TYPES.TEXT,
			variables: {}
		};
	};

	renderStyleBox = () => {
		const {editorState, textSettings} = this.props.values;

		if (editorState) {
			return (
				<StyleBox
					editorState={editorState}
					onChangeEditorState={this.updateEditorState}
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
			<FormField>
				<TextEditor
					className={styles.textEditor}
					content={content}
					handleKeyCommand={this.handleKeyCommand}
					keyBindingFn={this.keyBindingFn}
					name={FIELDS.editorState}
					onChange={this.handleChangeTextEditor}
					styleMap={styleMap}
					textAlign={textAlign}
					value={editorState}
				/>
			</FormField>
		);
	};

	render () {
		const {cancelForm, saving} = this.props;

		return (
			<WidgetForm
				onCancel={cancelForm}
				onSubmit={this.handleSubmit}
				title="Текст"
				updating={saving.loading}
			>
				<FormBox>
					{this.renderTextEditor()}
				</FormBox>
				{this.renderStyleBox()}
			</WidgetForm>
		);
	}
}

export default TextWidgetEditForm;
