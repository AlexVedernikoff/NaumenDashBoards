// @flow
import type {CustomGroup} from 'store/customGroups/types';
import type {RenderModal} from 'containers/GroupCreatingModal/types';

type DataMap = {
	[string]: Object
};

export type Props = {
	customGroups: Array<CustomGroup>,
	customOptions: Array<Object>,
	customType: string,
	onLoadData: () => void,
	renderModal: RenderModal,
	selectData: DataMap
};

export type State = {
	updateDate: Date
};
