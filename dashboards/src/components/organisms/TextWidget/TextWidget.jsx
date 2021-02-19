// @flow
import type {Content} from 'components/atoms/TextEditor/types';
import {convertFromRaw, EditorState, Modifier, SelectionState} from 'draft-js';
import {escapeString} from 'helpers';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import TextEditor from 'components/atoms/TextEditor';

export class TextWidget extends PureComponent<Props, State> {
	state = {
		editorState: this.getEditorStateWithReplacedVars(this.props)
	};

	componentDidUpdate (prevProps: Props) {
		const {widget: prevWidget} = prevProps;
		const {widget} = this.props;

		if (prevWidget !== widget) {
			this.setState({editorState: this.getEditorStateWithReplacedVars(this.props)});
		}
	}

	replaceVars (contentState: Content, regex: RegExp, value: string): Content {
		let nextContentState = contentState;

		const replaced = !!contentState.getBlockMap().find(contentBlock => {
			const text = contentBlock.getText();
			const matchArr = regex.exec(text);
			let replaced = false;

			if (matchArr !== null) {
				const start = matchArr.index;
				const end = start + matchArr[0].length;
				const blockKey = contentBlock.getKey();
				const blockSelection = SelectionState
					.createEmpty(blockKey)
					.merge({
						anchorOffset: start,
						focusOffset: end
					});

				nextContentState = Modifier.replaceText(
					contentState,
					blockSelection,
					value,
					contentBlock.getInlineStyleAt(start)
				);
				replaced = true;
			}

			return replaced;
		});

		if (replaced) {
			nextContentState = this.replaceVars(nextContentState, regex, value);
		}

		return nextContentState;
	}

	getEditorStateWithReplacedVars (props: Props) {
		const {textSettings, variables} = props.widget;
		let editorState = EditorState.createWithContent(convertFromRaw(textSettings.content));

		Object.keys(variables).forEach(key => {
			const regex = new RegExp(escapeString(key));

			editorState = EditorState.push(
				editorState,
				this.replaceVars(editorState.getCurrentContent(), regex, variables[key])
			);
		});

		return editorState;
	}

	render () {
		const {content, styleMap, textAlign} = this.props.widget.textSettings;
		const {editorState} = this.state;

		return (
			<div className={styles.container} >
				<TextEditor
					content={content}
					readOnly={true}
					styleMap={styleMap}
					textAlign={textAlign}
					value={editorState}
				/>
			</div>
		);
	}
}

export default TextWidget;
