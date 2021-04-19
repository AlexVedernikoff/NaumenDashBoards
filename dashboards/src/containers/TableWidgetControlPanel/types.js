// @flow
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {Props as ControlPanelProps} from 'components/organisms/DiagramWidget/components/ControlPanel/types';
import type {TableWidget} from 'store/widgets/data/types';

export type ConnectedProps = {
	data: DiagramBuildData | null
};

export type Props = ConnectedProps & ControlPanelProps & {
	widget: TableWidget
};
