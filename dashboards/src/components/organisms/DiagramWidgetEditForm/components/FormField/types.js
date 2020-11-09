// @flow
import type {ContextProps} from 'DiagramWidgetEditForm/types';
import type {Props as FormFieldProps} from 'components/molecules/FormField/types';

export type Props = {
	...FormFieldProps,
	...ContextProps
};
