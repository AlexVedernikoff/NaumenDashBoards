// @flow
import {defaultAction, initialDiagramsState} from './init';
import type {DiagramsAction, DiagramsState} from './types';
import {DIAGRAMS_EVENTS} from './constants';
import {resetData, setDiagram, setDiagramError, setRequestDiagram} from './helpers';
import {WIDGETS_EVENTS} from 'store/widgets/data/constants';

const reducer = (state: DiagramsState = initialDiagramsState, action: DiagramsAction = defaultAction): DiagramsState => {
	switch (action.type) {
		case DIAGRAMS_EVENTS.REQUEST_DIAGRAM:
			setRequestDiagram(state, action.payload);
			return {...state};
		case DIAGRAMS_EVENTS.REQUEST_DIAGRAMS:
			action.payload.forEach(({id}) => {
				setRequestDiagram(state, id);
			});
			return {...state};
		case DIAGRAMS_EVENTS.RECEIVE_DIAGRAM:
			setDiagram(state, action.payload);
			return {...state};
		case DIAGRAMS_EVENTS.RECEIVE_DIAGRAMS:
			Object.keys(action.payload).forEach(id => {
				// $FlowFixMe
				setDiagram(state, {data: action.payload[id], id: id});
			});
			return {...state};
		case DIAGRAMS_EVENTS.RECORD_DIAGRAM_ERROR:
			setDiagramError(state, action.payload);
			return {...state};
		case DIAGRAMS_EVENTS.RECORD_DIAGRAMS_ERROR:
			action.payload.forEach(({id}) => {
				setDiagramError(state, id);
			});
			return {...state};
		case WIDGETS_EVENTS.UPDATE_WIDGET:
		case WIDGETS_EVENTS.SET_CREATED_WIDGET:
			resetData(state, action);
			return {...state};
		default:
			return state;
	}
};

export default reducer;
