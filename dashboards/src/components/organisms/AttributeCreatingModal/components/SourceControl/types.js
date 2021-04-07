// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {ControlType} from 'components/organisms/AttributeCreatingModal/types';
import type {InjectedProps as InjectedValuesProps} from 'components/organisms/WidgetForm/HOCs/withValues/types';
import type {Props as ContainerProps} from 'containers/SourceControl/types';
import type {Source} from 'store/widgets/data/types';
import type {SourceData} from 'store/widgetForms/types';
export type Value = {
	aggregation: string,
	attribute: Attribute,
	dataKey: string,
	source: Source
};

type Values = {
	data: Array<{
		dataKey: string,
		source: SourceData
	}>
};

export type Props = InjectedValuesProps<Values> & ContainerProps & {
	index: number,
	name: string,
	onClickButton: (index: number, name: string) => void,
	onSelect: (index: number, name: string, value: Value, type: ControlType) => void,
	type: ControlType,
	value: Value | null
};

export type Option = {
	attributes: Array<Attribute>,
	dataKey: string,
	source: Source
};

export type State = {
	expanded: Array<string>,
	foundOptions: Array<Option>,
	options: Array<Option>,
	searchValue: string,
	showList: boolean
};
