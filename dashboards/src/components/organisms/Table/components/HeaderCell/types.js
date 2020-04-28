// @flow
import type {FontStyle, SortingType} from 'store/widgets/data/types';

export type Props = {
	fontColor: string,
	fontStyle?: FontStyle,
	index: number,
	onChangeWidth: (width: number, index: number) => void,
	onClick: (index: number) => void,
	onFinishedChangeWidth: (index: number) => void,
	sorting?: SortingType,
	value: string,
	width: number
};
