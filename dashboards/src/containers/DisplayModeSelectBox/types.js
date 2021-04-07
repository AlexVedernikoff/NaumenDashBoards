// @flow
import type {UserData} from 'src/store/context/types';

export type ConnectedProps = {
	personalDashboard: boolean,
	user: UserData,
};

export type Props = ConnectedProps;
