// @flow
import type {Action} from 'types/action';
import type {Option} from 'types/option';

type OwnProps = {};

export type ConnectedProps = {
	actions: Array<Action>,
	header: string,
	options: Array<Option>,
	statusColor: string,
	uuid: string
};

export type ConnectedFunctions = {};

export type Props = OwnProps & ConnectedProps & ConnectedFunctions;

export type State = {
	actionShow: boolean
};
