// @flow
import type {ToolbarHandler, ZoomMode} from 'components/molecules/Chart/types';

export type Props = {
	onChangeIcon: ZoomMode => void,
	toolbarHandler: (name: ToolbarHandler) => void,
	zoomMode: ZoomMode,
};
