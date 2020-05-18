// @flow
import type {CustomGroup} from 'store/customGroups/types';
import type {RenderModal} from 'containers/GroupCreatingModal/types';

type SelectData = {
	error: boolean,
	items: Array<Object>,
	loading: boolean
};

export type Props = {
	customGroups: Array<CustomGroup>,
	customOptions: Array<Object>,
	customType: string,
	onLoadData: () => void,
	renderModal: RenderModal,
	selectData: SelectData
};

export type State = {
	updateDate: Date
};
