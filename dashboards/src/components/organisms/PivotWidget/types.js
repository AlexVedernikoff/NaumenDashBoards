// @flow
import type {InjectOptionsProps} from 'containers/withBaseWidget/types';
import type {PivotOptions} from 'utils/recharts/types';

export type Props = InjectOptionsProps & {
	className: string
};

export type State = {
	columnsWidth: Array<number>,
	options: $Shape<PivotOptions>
};
