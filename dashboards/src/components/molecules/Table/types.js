// @flow
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {TableWidget} from 'store/widgets/data/types';

export type Props = {
	data: DiagramBuildData,
	onUpdate: TableWidget => void,
	widget: TableWidget
};

export type State = {
	width: null | number
};
