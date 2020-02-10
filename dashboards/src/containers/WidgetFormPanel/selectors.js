// @flow
import type {AppState} from 'store/types';
import {cancelForm, createWidget, saveWidget} from 'store/widgets/data/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchAttributes} from 'store/sources/attributes/actions';
import {fetchRefAttributes} from 'store/sources/refAttributes/actions';
import {NewWidget} from 'utils/widget';

export const props = (state: AppState): ConnectedProps => {
	const {context, dashboard, sources, widgets} = state;
	const {data} = widgets;
	const {newWidget, selectedWidget} = data;
	const {contentCode, subjectUuid, user} = context;
	const contentContext = {contentCode, subjectUuid};

	return {
		attributes: sources.attributes.map,
		context: contentContext,
		personalDashboard: dashboard.personal,
		refAttributes: sources.refAttributes,
		saveError: data.saveError,
		selectedWidget: selectedWidget === NewWidget.id && newWidget ? newWidget : data.map[selectedWidget],
		sources: sources.data.map,
		updating: data.updating,
		user
	};
};

export const functions: ConnectedFunctions = {
	cancelForm,
	createWidget,
	fetchAttributes,
	fetchRefAttributes,
	saveWidget
};
