// @flow
import type {OnChangeEvent} from 'components/types';

export type Props = {
	checked: boolean,
	name: string,
	onChange: OnChangeEvent<boolean> => void,
	value: boolean
};
