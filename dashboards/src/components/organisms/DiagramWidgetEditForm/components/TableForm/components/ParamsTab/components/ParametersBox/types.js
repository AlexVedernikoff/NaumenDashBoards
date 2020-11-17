// @flow
import type {ContextProps} from 'DiagramWidgetEditForm/types';
import type {DataSet} from 'containers/DiagramWidgetEditForm/types';
import type {Props as IconButtonProps} from 'components/atoms/IconButton/types';

export type Props = {
	...ContextProps,
	dataSet: DataSet,
	index: number,
	renderAddInput: (props: $Shape<IconButtonProps>) => React$Node
};
