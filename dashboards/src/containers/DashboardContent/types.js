// @flow
import type {UserData} from 'store/context/types';
export type ConnectedProps = {
	editableDashboard: boolean,
	editMode: boolean,
	isMobileDevice: boolean,
	showHeader: boolean,
	user: UserData
};

export type Props = ConnectedProps;

export type State = {
	intersecting: boolean
};
