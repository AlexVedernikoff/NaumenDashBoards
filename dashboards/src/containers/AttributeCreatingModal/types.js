// @flow
import type {AttributesMap, FetchAttributesAction} from 'store/sources/attributes/types';
import type {Props as ComponentProps} from 'components/organisms/AttributeCreatingModal/types';
import type {SourceData} from 'store/widgetForms/types';
import type {Tree as TreeType} from 'utils/arrayToTree/types';

export type ConnectedProps = {
	attributes: AttributesMap
};

export type ConnectedFunctions = {
	fetchAttributes: FetchAttributesAction
};

export type Props = ConnectedProps & ConnectedFunctions & {
	...ComponentProps,
	options: void,
	values: {
		data: Array<{
			dataKey: string,
			source: SourceData,
			sourceForCompute: boolean
		}>
	}
};

export type State = {
	optionsTree: TreeType
};
