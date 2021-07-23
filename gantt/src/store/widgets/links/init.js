// @flow
import type {LinksAction, LinksState} from './types';
import {LINKS_EVENTS} from './constants';

export const initialLinksState: LinksState = {
	map: {}
};

export const defaultAction: LinksAction = {
	type: LINKS_EVENTS.UNKNOWN_LINKS_ACTION
};
