// @flow
import {defaultAction, initialLinksState} from './init';
import type {LinksAction, LinksState} from './types';
import {LINKS_EVENTS} from './constants';
import {setLink, setLinkError, setRequestLink} from './helpers';

const reducer = (state: LinksState = initialLinksState, action: LinksAction = defaultAction): LinksState => {
	switch (action.type) {
		case LINKS_EVENTS.REQUEST_LINK:
			return setRequestLink(state, action);
		case LINKS_EVENTS.RECEIVE_LINK:
			return setLink(state, action);
		case LINKS_EVENTS.RECORD_LINK_ERROR:
			return setLinkError(state, action);
		default:
			return state;
	}
};

export default reducer;
