// @flow
import type {BordersStyle} from 'store/widgets/data/types';

export type Props = {
	name: string,
	onChange: (name: string, data: BordersStyle, callback: Function) => void,
	value: BordersStyle,
};
