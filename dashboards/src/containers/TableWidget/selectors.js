// @flow
import type {ConnectedFunctions} from './types';
import {drillDown, openCardObject} from 'store/widgets/links/actions';
import {fetchBuildData} from 'store/widgets/buildData/actions';
import {updateWidget} from 'store/widgets/data/actions';

export const functions: ConnectedFunctions = {
	drillDown,
	fetchBuildData,
	openCardObject,
	updateWidget
};
