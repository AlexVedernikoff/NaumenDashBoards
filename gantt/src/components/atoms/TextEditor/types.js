// @flow
import type {TextAlign} from 'store/widgets/data/types';

export type EditorState = Object;

export type Content = Object;

export type Value = EditorState;

export type OnChangeEvent = {
	name: string,
	value: Value
};

export type StyleValue = string | number;

export type StyleMap = {
	[styleMapName: string]: {
		[styleName: string]: StyleValue
	}
};

export type Props = {
	className: string,
	content?: Content,
	handleKeyCommand?: (command: string, editorState: EditorState, eventTimeStamp: number) => string,
	keyBindingFn?: (e: SyntheticKeyboardEvent<HTMLElement>) => string | null,
	name: string,
	onChange?: (event: OnChangeEvent) => void,
	readOnly: boolean,
	styleMap: StyleMap,
	textAlign: TextAlign,
	value: Value
};
