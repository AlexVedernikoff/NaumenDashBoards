// @flow
import type {PivotStyle} from 'src/store/widgets/data/types';

export type Props = {
	name: string,
	onChange: (name: string, value: PivotStyle) => void,
	value: PivotStyle
};
