// @flow
import type {UserData} from 'src/store/context/types';

export type ConnectedProps = {
	isUserMode: boolean,
	personalDashboard: boolean,
	user: UserData,
};

export type Props = ConnectedProps;
