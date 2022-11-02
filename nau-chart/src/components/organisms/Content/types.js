// @flow
import type {Action, Entity} from 'store/entity/types';

export type ConnectedProps = {
};

export type ConnectedFunctions = {
};

export type Props = ConnectedProps & ConnectedFunctions;

export interface Connector extends Entity {
	angle: string,
	x: string,
	y: string,
}

export type OptionsSizeCanvas = {
	maxX: string,
	maxY: string,
	minY: string,
};

export type RenderTitleProps = {
	actions: Array<Action>,
	codeEditingForm: string,
	title: string,
	uuid: string,
};
