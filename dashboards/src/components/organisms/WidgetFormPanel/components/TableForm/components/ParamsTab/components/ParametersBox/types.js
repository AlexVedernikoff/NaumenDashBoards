// @flow
import type {ContextProps} from 'WidgetFormPanel/types';
import type {DataSet} from 'containers/WidgetFormPanel/types';
import type {Props as IconButtonProps} from 'components/atoms/IconButton/types';

export type Props = {
	...ContextProps,
	index: number,
	renderAddInput: (props: $Shape<IconButtonProps>) => React$Node,
	set: DataSet
};
