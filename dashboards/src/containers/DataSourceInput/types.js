// @flow
import type {AttributeMap} from 'store/sources/attributes/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {SelectValue} from 'components/organisms/WidgetFormPanel/types';

export type ConnectedProps = {
	attributes: AttributeMap,
	dataSources: DataSourceMap
};

type ReceivedProps = {
	onChange: (SelectValue) => void,
	value: SelectValue
}

export type Props = ReceivedProps & ConnectedProps;
