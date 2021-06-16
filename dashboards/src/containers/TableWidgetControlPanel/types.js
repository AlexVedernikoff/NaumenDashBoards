// @flow
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {Props as ControlPanelProps} from 'components/organisms/DiagramWidget/components/ControlPanel/types';
import type {TableWidget} from 'store/widgets/data/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	data: DiagramBuildData | null
};

export type ConnectedFunctions = {
	exportExcel: (widget: TableWidget, rowCount: number) => ThunkAction,
};

export type Props = ConnectedProps & ConnectedFunctions & ControlPanelProps & {
	widget: TableWidget
};
