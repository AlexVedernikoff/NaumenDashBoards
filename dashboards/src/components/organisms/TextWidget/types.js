// @flow
import type {EditorState} from 'components/atoms/TextEditor/types';
import type {TextWidget} from 'store/widgets/data/types';

export type Props = {
	widget: TextWidget
};

export type State = {
	editorState: EditorState
};
