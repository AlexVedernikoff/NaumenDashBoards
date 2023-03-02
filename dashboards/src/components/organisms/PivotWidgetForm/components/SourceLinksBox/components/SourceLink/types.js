// @flow
import type {ComponentProps as SourceLinkEditorProps} from 'containers/SourceLinkEditor/types';
import type {DataSet} from 'store/widgetForms/pivotForm/types';
import type {EditPanelPosition} from 'store/dashboard/settings/types';
import type {PivotLink} from 'store/widgets/data/types';

export type Components = {
	SourceLinkEditor: React$ComponentType<SourceLinkEditorProps>,
};

export type Props = {
	components: Components,
	data: Array<DataSet>,
	index: number,
	link: PivotLink,
	onChange: (value: PivotLink) => void,
	onDelete: () => void,
	position: EditPanelPosition,
};

export type State = {
	hasEdit: boolean,
};
