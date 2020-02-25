// @flow
import type {AutoUpdateSettings} from 'store/dashboard/types';
import type {ThunkAction} from 'store/types';

export type Props = {
	autoUpdateSettings: AutoUpdateSettings,
	className: string,
	onSubmit: (enabled: boolean, interval: number | string) => ThunkAction,
};

type ErrorsMap = {
	[string]: string
};

export type Values = {
	enabled: boolean,
	interval: string | number
};

export type State = {
	errors: ErrorsMap,
	isSubmitting: boolean,
	values: Values
};
