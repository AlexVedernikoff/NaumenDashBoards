// @flow
import type {Props as ContainerProps} from 'containers/AutoUpdateButton/types';

export type Props = {
	...ContainerProps,
	className: string,
};

type ErrorsMap = {
	[string]: string
};

export type Values = {
	enabled: boolean,
	interval: number
};

export type State = {
	errors: ErrorsMap,
	isSubmitting: boolean,
	remainder: number,
	values: Values
};
