// @flow
import type {FontStyle} from 'store/widgets/data/types';

export type Props = {
	color: string,
	fontFamily: string,
	fontSize: string | number, // '10px' | '10' | 10
	fontStyle: ?FontStyle,
	onClick: () => void,
	value: string | number
};

export type State = {
	fontSize: number | null
};
