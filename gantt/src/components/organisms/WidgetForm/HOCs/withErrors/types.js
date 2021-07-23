// @flow
import type {ErrorsMap} from 'components/organisms/WidgetForm/types';
import type {Ref} from 'src/components/types';

export type ErrorsContext = {
	errors: ErrorsMap,
	setErrorFocusRef: (ref: Ref<'div'>) => void
};

export type InjectedProps = {
	errors: ErrorsMap,
	onSetErrorFocusRef: (ref: Ref<'div'>) => void
};
