// @flow
import type {DataSourceMap} from 'store/sources/data/types';
import type {Props as ComponentProps} from 'TableWidgetForm/components/DataSetSettings/types';

export type ConnectedProps = {
	sources: DataSourceMap
};

export type Props = ConnectedProps & ComponentProps;
