// @flow
import type {DisplayMode, TextSettings} from 'store/widgets/data/types';
import type {EditorState} from 'components/atoms/TextEditor/types';

export type Values = $Exact<{
	displayMode: DisplayMode,
	editorState: EditorState,
	textSettings: TextSettings
}>;

export type State = Values;
