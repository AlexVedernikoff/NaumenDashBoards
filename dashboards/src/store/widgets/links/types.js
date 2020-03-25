// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Group} from 'store/widgets/data/types';
import {LINKS_EVENTS} from './constants';

type Filter = {
	attribute: Attribute,
	group: Group | null,
	value: string | number
};

export type DrillDownMixin = {
	cases?: [],
	classFqn?: string | null,
	descriptor?: string,
	filters: Array<Filter>,
	title: string
};

export type Link = {
	data?: string,
	error: boolean,
	loading: boolean
};

export type LinkMap = {
	[key: string]: Link
};

export type ReceiveLinkPayload = {
	id: string,
	link: string
};

export type RequestLink = {
	type: typeof LINKS_EVENTS.REQUEST_LINK,
	payload: string
};

export type ReceiveLink = {
	type: typeof LINKS_EVENTS.RECEIVE_LINK,
	payload: ReceiveLinkPayload
};

export type RecordErrorLink = {
	type: typeof LINKS_EVENTS.RECORD_LINK_ERROR,
	payload: string
};

type UnknownLinksAction = {
	type: typeof LINKS_EVENTS.UNKNOWN_LINKS_ACTION
};

export type LinksAction =
	| RequestLink
	| ReceiveLink
	| RecordErrorLink
	| UnknownLinksAction
;

export type LinksState = {
	map: LinkMap
};
