// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps, OwnProps} from './types';

const props = (appState: AppState, props: OwnProps): ConnectedProps => {
	const {signature} = appState;
	const {data} = signature;
	const {saveNewPartSignature, stageRef} = props;

	return {
		data,
		saveNewPartSignature,
		stageRef
	}
};

export {
	props
};
