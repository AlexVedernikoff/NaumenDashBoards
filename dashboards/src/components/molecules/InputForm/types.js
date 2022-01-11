// @flow
import type {InputRef} from 'components/types';
import type {SubscribeContext} from 'components/organisms/WidgetForm/HOCs/withSubscriptions/types';

export type Props = SubscribeContext & {
	className: string,
	forwardedRef?: InputRef,
	onClose: () => void,
	onSubmit: (value: string, callback?: Function) => any,
	value: string | number
};

export type State = {
	value: string
};
