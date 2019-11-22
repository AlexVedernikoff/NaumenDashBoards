// @flow
import type {Toast} from 'store/toasts/types';

export type Props = {
	data: Toast,
	onMount: (toast: Toast) => void,
}
