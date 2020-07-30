// @flow
import type {Chart} from 'store/widgets/data/types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {TOOLBAR_HANDLERS, ZOOM_MODES} from './constants';

export type ToolbarHandler = $Values<typeof TOOLBAR_HANDLERS>;

export type ZoomMode = $Values<typeof ZOOM_MODES>;

export type Props = {
	data: DiagramBuildData,
	focused: boolean,
	widget: Chart
};

export type State = {
	zoomMode: ZoomMode
};
