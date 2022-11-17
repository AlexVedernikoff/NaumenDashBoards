// @flow
import type {Action, Entity} from 'store/entity/types';

export type RenderTitleProps = {
	actions: Array<Action>,
	codeEditingForm: string,
	title: string,
	uuid: string,
};

export type ConnectedProps = {
	activeElement: Entity,
	data: Entity[],
};

export type ConnectedFunctions = {
	goToPoint: (uuid: string) => {},
	showEditForm: (uuid: string, codeEditingForm: string) => {},
};

export type Props = ConnectedProps & ConnectedFunctions;
