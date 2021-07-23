// @flow
import type {Header} from 'store/widgets/data/types';

export type DefaultProps = {
	className: string;
};

export type Props = {
	...DefaultProps,
	onChangeHeight: (height: number) => void,
	settings: Header,
	widgetName: string
};
