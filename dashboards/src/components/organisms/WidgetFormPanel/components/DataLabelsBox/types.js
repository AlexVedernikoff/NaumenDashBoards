// @flow
import type {AnyWidget, DataLabels} from 'store/widgets/data/types';
import NewWidget from 'store/widgets/data/NewWidget';

export type Props = {
	name: string,
	onChange: (name: string, value: DataLabels) => void,
	value: DataLabels,
	widget: AnyWidget | NewWidget
};
