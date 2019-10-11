// @flow
import {buildUrl, client} from 'utils/api';
import {createOrderName} from 'utils/widget';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {LINKS_EVENTS} from './constants';
import type {GoOverMixin, ReceiveLinkPayload} from './types';
import type {Widget} from 'store/widgets/data/types';

const createPostData = (widget: Widget, mixin: ?GoOverMixin) => {
	const {order} = widget;
	const source = order ? widget[createOrderName(order[0])(FIELDS.source)] : widget[FIELDS.source];
	let classFqn = source && source.value;
	const cases = [];

	if (classFqn && classFqn.includes('$')) {
		const parts = classFqn.split('$');
		classFqn = parts.shift();
		cases.push(parts.pop());
	}

	let postData = {
		title: widget.diagramName,
		classFqn,
		cases
	};

	if (mixin) {
		postData = {...postData, ...mixin};
	}

	return postData;
};

const goOver = (id: string, mixin: ?GoOverMixin): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	const {widgets} = getState();
	const {data, links} = widgets;
	const widget = data.map[id];
	let link = links[id];

	if (!link) {
		dispatch(requestLink(id));

		try {
			const {data} = await client.post(
				buildUrl('dashboardDrildown', 'getLink', 'requestContent'),
				createPostData(widget, mixin)
			);
			link = data;
			dispatch(
				receiveLink({link, id})
			);
		} catch (e) {
			dispatch(recordLinkError(id));
		}
	}

	link && window.open(link);
};

const requestLink = (payload: string) => ({
	type: LINKS_EVENTS.REQUEST_LINK,
	payload
});

const receiveLink = (payload: ReceiveLinkPayload) => ({
	type: LINKS_EVENTS.RECEIVE_LINK,
	payload
});

const recordLinkError = (payload: string) => ({
	type: LINKS_EVENTS.RECORD_LINK_ERROR,
	payload
});

export {
	goOver
};
