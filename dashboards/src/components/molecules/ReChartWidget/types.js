// @flow
import type {Chart} from 'store/widgets/data/types';
import type {InjectLoadingProps} from 'containers/withBaseWidget/types';

export type Props = InjectLoadingProps & {
	children: React$Node,
	updateOptions: (container: HTMLDivElement) => void,
	widget: Chart
};

export type State = {
	showTotal: boolean,
};
