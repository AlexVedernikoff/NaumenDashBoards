// @flow
import type {Header} from 'store/widgets/data/types';

export type Props = {
	name: string,
	onChange: (name: string, data: Header) => void,
	value: Header
};
