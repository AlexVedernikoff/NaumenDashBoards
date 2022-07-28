// @flow
import api from 'api';
import type {Attribute} from 'store/sources/attributes/types';
import type {Dispatch, ThunkAction} from 'store/types';
import {getLinkedAttributesKey} from './helpers';

export const fetchLinkedAttributes = (parentClassFqn: string, classFqn: string): ThunkAction =>
	async (dispatch: Dispatch): Promise<Array<Attribute>> => {
		const key = getLinkedAttributesKey(parentClassFqn, classFqn);
		let attributes = [];

		try {
			dispatch({payload: {key}, type: 'REQUEST_LINKED_ATTRIBUTES'});

			attributes = await api.instance.dashboards.getLinkedAttributes(parentClassFqn, classFqn);

			dispatch({payload: {attributes, key}, type: 'RECEIVE_LINKED_ATTRIBUTES'});
		} catch (ex) {
			dispatch({payload: {key}, type: 'REQUEST_LINKED_ATTRIBUTES_ERROR'});
		}

		return [];
	};
