// @flow
import type {EditorState} from 'components/atoms/TextEditor/types';
import type {TextSettings} from 'store/widgets/data/types';

export type Props = {
	editorState: EditorState,
	onChangeEditorState: EditorState => void,
	onChangeTextSettings: TextSettings => void,
	textSettings: TextSettings
};
