// @flow
import type {OnChangeEvent} from 'components/types';

export type Props = {
	name: string,
	onChange: OnChangeEvent<string> => void,
	value: string,
};

export type State = {
	currentColor: string
};

export type Option = {
	previewColor: string,
	value: string
};
