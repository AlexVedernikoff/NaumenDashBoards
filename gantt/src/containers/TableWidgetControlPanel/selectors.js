// @flow
import type {AppState} from 'src/store/types';
import type {ConnectedFunctions, ConnectedProps, Props} from './types';
import {exportTableToXLSX} from 'store/widgets/buildData/actions';

export const props = (state: AppState, props: Props): ConnectedProps => ({
	data: state.widgets.buildData[props.widget.id]?.data
});

export const functions: ConnectedFunctions = {
	exportExcel: exportTableToXLSX
};
