// @flow
import 'draft-js/dist/Draft.css';
import {CHANGE_TYPES, COMMAND_EVENTS} from './constants';
import cn from 'classnames';
import {ContentState, convertFromRaw, Editor, EditorState, Modifier} from 'draft-js';
import type {EditorState as EEditorStateType, Props} from './types';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'components/types';
import styles from './styles.less';

export class TextEditor extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		name: '',
		readOnly: false
	};

	editorRef: Ref<typeof Editor> = createRef();

	componentDidMount () {
		const {value} = this.props;

		!value && this.handleChange(this.getEditorStateFromContent());
	}

	componentDidUpdate (prevProps: Props) {
		const {content} = this.props;
		const {content: prevContent} = prevProps;

		if (content !== prevContent) {
			this.handleChange(this.getEditorStateFromContent());
		}
	}

	focusEditor = () => {
		const {current: editor} = this.editorRef;

		editor && editor.focus();
	};

	getEditorStateFromContent = (): EEditorStateType => {
		const {content} = this.props;

		return content
			? EditorState.createWithContent(convertFromRaw(content))
			: EditorState.createEmpty();
	};

	handleChange = (editorState: EEditorStateType) => {
		const {name, onChange} = this.props;

		onChange && onChange({name, value: editorState});
	};

	handlePastedText = (text: string, html?: string, editorState: EditorState) => {
		const pastedBlocks = ContentState.createFromText(text).blockMap;
		const newState = Modifier.replaceWithFragment(
			editorState.getCurrentContent(),
			editorState.getSelection(),
			pastedBlocks
		);
		const newEditorState = EditorState.push(editorState, newState, CHANGE_TYPES.INSERT_CHANGE_TYPE);

		this.handleChange(newEditorState);

		return COMMAND_EVENTS.COMMAND_HANDLED_EVENT;
	};

	renderEditor = () => {
		const {handleKeyCommand, keyBindingFn, readOnly, styleMap, textAlign, value} = this.props;

		if (value) {
			return (
				<Editor
					customStyleMap={styleMap}
					editorState={value}
					handleKeyCommand={handleKeyCommand}
					handlePastedText={this.handlePastedText}
					keyBindingFn={keyBindingFn}
					onChange={this.handleChange}
					readOnly={readOnly}
					ref={this.editorRef}
					textAlignment={textAlign}
				/>
			);
		}

		return null;
	};

	render () {
		const {className} = this.props;

		return (
			<div className={cn(styles.editor, className)} onClick={this.focusEditor}>
				{this.renderEditor()}
			</div>
		);
	}
}

export default TextEditor;
