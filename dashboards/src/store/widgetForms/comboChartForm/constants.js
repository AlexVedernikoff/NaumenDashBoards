// @flow
import {DISPLAY_MODE} from 'store/widgets/data/constants';
import type {State} from './types';

const userMode: $Shape<State> = {
	displayMode: DISPLAY_MODE.ANY
};

export {userMode};
