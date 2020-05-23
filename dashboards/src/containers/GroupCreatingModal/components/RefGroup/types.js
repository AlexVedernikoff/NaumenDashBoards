// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {CustomGroup} from 'store/customGroups/types';
import type {FetchCurrentObjectAttributes, RenderModal} from 'containers/GroupCreatingModal/types';
import type {TypeData} from 'store/sources/currentObject/types';

type SelectData = {
	error: boolean,
	items: Array<Object>,
	loading: boolean
};

export type State = {
	updateDate: Date
};

export type ConnectedProps = {|
	currentObject: TypeData
|};

export type ConnectedFunctions = {|
	fetchCurrentObjectAttributes: FetchCurrentObjectAttributes
|};

export type Props = {
	attribute: Attribute,
	customGroups: Array<CustomGroup>,
	customOptions: Array<Object>,
	customType: string,
	onLoadData: () => void,
	renderModal: RenderModal,
	selectData: SelectData,
	...ConnectedProps,
	...ConnectedFunctions
};
