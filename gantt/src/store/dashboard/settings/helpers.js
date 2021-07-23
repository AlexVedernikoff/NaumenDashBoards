// @flow
import {LOCAL_STORAGE_VARS} from 'store/constants';

const initPersonalProperty = () => localStorage.getItem(LOCAL_STORAGE_VARS.PERSONAL_DASHBOARD) === 'true';

export {
	initPersonalProperty
};
