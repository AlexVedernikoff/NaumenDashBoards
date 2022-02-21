// @flow
import type {OnChangeEvent} from 'components/types';

export type Props = {
	checked: boolean,
	disabled: boolean,
	name: string,
	onChange: OnChangeEvent<boolean> => void,
	value: boolean
};
