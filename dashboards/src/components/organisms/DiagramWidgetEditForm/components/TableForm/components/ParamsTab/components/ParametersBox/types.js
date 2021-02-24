// @flow
import type {DataSet, Parameter} from 'containers/DiagramWidgetEditForm/types';
import type {ErrorsMap} from 'containers/WidgetEditForm/types';
import type {Props as IconButtonProps} from 'components/atoms/IconButton/types';

export type Props = {
	dataSet: DataSet,
	errors: ErrorsMap,
	index: number,
	onChange: (index: number, parameters: Array<Parameter>) => void,
	renderAddInput: (props: $Shape<IconButtonProps>) => React$Node
};
