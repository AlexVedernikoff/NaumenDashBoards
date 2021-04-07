// @flow
import {DISPLAY_MODE, TEXT_ALIGNS} from 'store/widgets/data/constants';
import {EditorState} from 'draft-js';
import type {State} from './types';

export const initialState: State = {
	displayMode: DISPLAY_MODE.WEB,
	editorState: EditorState.createEmpty(),
	textSettings: {
		content: '',
		styleMap: {},
		textAlign: TEXT_ALIGNS.center
	}
};
