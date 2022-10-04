// @flow
import type {Chart} from 'store/widgets/data/types';
import type {InjectOptionsProps} from 'containers/withBaseWidget/types';
import type {PivotOptions} from 'utils/recharts/types';

export type DrillDownAction = (
	indicator: string,
	parameters: Array<{key: string, value: string}>,
	breakdown?: string
) => void;

export type Props = InjectOptionsProps & {
	className: string,
	widget: Chart
};

export type State = {
	columnsWidth: Array<number>,
	options: $Shape<PivotOptions>
};
