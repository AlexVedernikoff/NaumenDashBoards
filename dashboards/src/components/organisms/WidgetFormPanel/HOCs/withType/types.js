// @flow
import type {WidgetType} from 'store/widgets/data/types';
export type Context = {
	onChange: (type: string) => void,
	value: WidgetType
};

export type InjectedProps = {
	type: Context
};

export type Props = Object;
