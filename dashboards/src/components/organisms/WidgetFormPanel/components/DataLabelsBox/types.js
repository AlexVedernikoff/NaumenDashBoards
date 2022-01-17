// @flow
import type {AnyWidget, DataLabels} from 'store/widgets/data/types';
import NewWidget from 'store/widgets/data/NewWidget';

export type DefaultProps = {
	name: string,
	showFormat: boolean,
};

export type Props = {
	...DefaultProps,
	onChange: (name: string, value: DataLabels, callback?: Function) => void,
	value: DataLabels,
	widget: AnyWidget | NewWidget
};

export type ComponentProps = React$Config<Props, DefaultProps>;
