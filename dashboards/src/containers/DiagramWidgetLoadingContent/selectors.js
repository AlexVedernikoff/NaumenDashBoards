// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';
import {fetchBuildData} from 'store/widgets/buildData/actions';
import {getWidgetBuildData} from 'store/widgets/data/selectors';
import type {Props} from 'components/molecules/Chart/types';

export const props = (state: AppState, props: Props): ConnectedProps => {
	const {widget} = props;

	return {
		buildData: getWidgetBuildData(state, widget)
	};
};

export const functions = {
	fetchBuildData
};
