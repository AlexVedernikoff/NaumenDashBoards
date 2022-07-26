// @flow
import type {DataSet} from 'store/widgetForms/pivotForm/types';
import type {EditPanelPosition} from 'store/dashboard/settings/types';
import type {PivotLink} from 'store/widgets/data/types';
import type {Props as SourceLinkProps} from './components/SourceLink/types';
import type {Props as SourceLinkEditorProps} from 'containers/SourceLinkEditor/types';

export type Components = {
	SourceLink: React$ComponentType<SourceLinkProps>,
	SourceLinkEditor: React$ComponentType<SourceLinkEditorProps>,
};

export type Props = {
	components: Components,
	data: Array<DataSet>,
	links: Array<PivotLink>,
	onChange: (value: Array<PivotLink>) => void,
	position: EditPanelPosition,
};
