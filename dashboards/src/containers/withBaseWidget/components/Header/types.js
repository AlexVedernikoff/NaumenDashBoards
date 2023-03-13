// @flow
import type {Widget} from 'store/widgets/data/types';

export type DefaultProps = {
	className: string
};

export type Props = {
	...DefaultProps,
	onChangeHeight: (height: number) => void,
	widget: Widget,
};
