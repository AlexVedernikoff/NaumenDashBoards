// @flow
import {LABEL_DRAW_MODE} from 'utils/recharts/constants';
import type {Labels} from 'utils/recharts/types';

export type LabelPayload = {
	coordinate: number,
	index: number,
	isShow: boolean,
	offset: number,
	tickCoord: number,
	value: string
};

export type CategoryLabelProps = {
	className: string,
	fill: string,
	fontFamily: string,
	fontSize: number,
	height: number,
	index: number,
	mode: $Keys<typeof LABEL_DRAW_MODE>,
	multilineLabels?: Labels,
	orientation: string,
	payload: LabelPayload,
	stroke: string,
	textAnchor: string,
	tickFormatter: (val: string) => string,
	type: string,
	verticalAnchor: string,
	visibleTicksCount: number,
	width: number,
	x: number,
	y: number,
};

export type CategoryLabelState = {
	trimString: string,
};
