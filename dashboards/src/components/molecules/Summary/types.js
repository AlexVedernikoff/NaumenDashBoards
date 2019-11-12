// @flow
import type {DiagramData} from 'store/widgets/diagrams/types';
import type {Widget} from 'store/widgets/data/types';

export type Props = {
	data: DiagramData,
	widget: Widget
};

export type State = {
	height: number,
	title: string,
	total: number
}
