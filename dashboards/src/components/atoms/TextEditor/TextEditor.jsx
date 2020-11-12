// @flow
import 'draft-js/dist/Draft.css';
import cn from 'classnames';
import {convertFromRaw, Editor, EditorState} from 'draft-js';
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
		this.handleChange(this.getEditorStateFromContent());
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

	renderEditor = () => {
		const {handleKeyCommand, keyBindingFn, readOnly, styleMap, textAlign, value} = this.props;

		if (value) {
			return (
				<Editor
					customStyleMap={styleMap}
					editorState={value}
					handleKeyCommand={handleKeyCommand}
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
