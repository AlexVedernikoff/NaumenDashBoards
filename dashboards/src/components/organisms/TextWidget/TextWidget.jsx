// @flow
import type ContentBlock from 'draft-js/lib/ContentBlock.js.flow';
import {convertFromRaw, EditorState, Modifier, SelectionState} from 'draft-js';
import {escapeString} from 'src/helpers';
import type {FindWithRegexCallback, Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {TextEditor} from 'components/atoms';

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

	findVarWithRegex (regex: RegExp, contentBlock: ContentBlock, callback: FindWithRegexCallback) {
		const text = contentBlock.getText();
		let matchArr;
		let start;
		let end;

		do {
			matchArr = regex.exec(text);

			if (matchArr !== null) {
				start = matchArr.index;
				end = start + matchArr[0].length;
				callback(start, end);
			}
		} while (matchArr);
	}

	getEditorStateWithReplacedVars (props: Props) {
		const {textSettings, variables} = props.widget;
		const editorState = EditorState.createWithContent(convertFromRaw(textSettings.content));
		const blockMap = editorState.getCurrentContent().getBlockMap();
		let nextEditorState = editorState;

		Object.keys(variables).forEach(key => {
			const regex = new RegExp(escapeString(key), 'g');
			const selectionsToReplace = [];

			blockMap.forEach(contentBlock => (
				this.findVarWithRegex(regex, contentBlock, (start, end) => {
					const blockKey = contentBlock.getKey();
					const blockSelection = SelectionState
						.createEmpty(blockKey)
						.merge({
							anchorOffset: start,
							focusOffset: end
						});

					selectionsToReplace.push([blockSelection, contentBlock.getInlineStyleAt(start)]);
				})
			));

			let contentState = nextEditorState.getCurrentContent();

			selectionsToReplace.forEach(([selectionState, style]) => {
				contentState = Modifier.replaceText(
					contentState,
					selectionState,
					variables[key],
					style
				);
			});

			nextEditorState = EditorState.push(
				nextEditorState,
				contentState
			);
		});

		return nextEditorState;
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
