// @flow
import type {ConnectedFunctions, ConnectedProps} from 'containers/DashboardPanel/types';
import type {DivRef} from 'components/types';

export type Props = ConnectedProps & ConnectedFunctions & {
	goBack: (isCancel: boolean, relativeElement?: DivRef) => void,
};

export type State = {
	width: number
};
