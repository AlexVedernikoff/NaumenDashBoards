// @flow
import type {Header} from 'store/widgets/data/types';

export type Props = {
	onChangeHeight: (height: number) => void,
	settings: Header,
	widgetName: string
};
