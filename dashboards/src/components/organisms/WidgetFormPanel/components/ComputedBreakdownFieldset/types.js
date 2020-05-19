// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {ComputedBreakdown} from 'store/widgets/data/types';
import type {DataSet, ErrorsMap} from 'containers/WidgetFormPanel/types';
import type {TransformAttribute} from 'WidgetFormPanel/types';

export type Props = {
	data: Array<DataSet>,
	errors: ErrorsMap,
	getAttributeOptions: (attribute: Attribute) => Array<Attribute>,
	getSourceOptions: (classFqn: string) => Array<Attribute>,
	index: number,
	name: string,
	onChange: (index: number, name: string, value: ComputedBreakdown) => void,
	onRemove: (index: number) => void,
	removable: boolean,
	transformAttribute: TransformAttribute,
	value: ComputedBreakdown
};
