// @flow
import type {DataSet} from 'store/widgetForms/pivotForm/types';
import type {MapData as LinkedAttributesMapData} from 'store/sources/linkedAttributes/types';
import type {PivotLink} from 'store/widgets/data/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	attributes: ?LinkedAttributesMapData
};

export type ConnectedFunctions = {
	fetchLinkedAttributes: (parentClassFqn: string, classFqn: string) => ThunkAction
};

export type ComponentProps = {
	className: string,
	data: Array<DataSet>,
	onCancel: () => void,
	onChange: (value: PivotLink) => void,
	value: PivotLink,
};

export type Props = ConnectedProps & ComponentProps & ConnectedFunctions;
