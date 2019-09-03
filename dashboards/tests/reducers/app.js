// @flow
'use strict';
import app from 'reducers/app';
import {APP_EVENTS} from 'constants/app';
import deepFreeze from 'deep-freeze';
import {initialAppState} from 'init/app';

describe('app reducer', () => {
	describe('default functionality', () => {
		it(`it returns initial app state when 'state' argument is undefined`, () => {
			expect(app()).toEqual(initialAppState);
		});

		it(`it returns unchanged state when action type is not recognized`, () => {
			const stateBefore = {
				...initialAppState,
				counter: 5
			};
			const stateAfter = {
				...initialAppState,
				counter: 5
			};

			expect(app(deepFreeze(stateBefore), {type: APP_EVENTS.UNKNOWN})).toEqual(stateAfter);
		});
	});
});
