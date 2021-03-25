// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps, Props} from './types';
import {drillDown, openCardObject} from 'store/widgets/links/actions';
import {fetchTableBuildData} from 'store/widgets/buildData/actions';
import {updateWidget} from 'store/widgets/data/actions';

export const props = (state: AppState, props: Props): ConnectedProps => ({
	updating: state.widgets.buildData[props.widget.id]?.updating ?? false
});

export const functions: ConnectedFunctions = {
	drillDown,
	openCardObject,
	updateData: fetchTableBuildData,
	updateWidget
};
