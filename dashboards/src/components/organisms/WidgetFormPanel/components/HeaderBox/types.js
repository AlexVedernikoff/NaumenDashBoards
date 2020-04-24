// @flow
import type {Header} from 'store/widgets/data/types';
import type {StyleBuilderProps} from 'WidgetFormPanel/builders/StyleFormBuilder/types';

export type Props = {
	...StyleBuilderProps,
	data: Header,
	name: string,
	onChange: (name: string, data: Header) => void
};
