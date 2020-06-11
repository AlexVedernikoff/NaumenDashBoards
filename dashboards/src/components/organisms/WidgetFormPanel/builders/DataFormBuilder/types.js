// @flow
import type {DataSet, SetDataFieldValue, SetFieldValue, Values} from 'containers/WidgetFormPanel/types';
import type {OnChangeInputEvent} from 'components/types';
import type {ParamsTabProps} from 'WidgetFormPanel/types';

export type TextAreaProps = {
	errorPath?: string,
	handleBlur?: (e: SyntheticInputEvent<HTMLInputElement>) => void,
	handleChange: OnChangeInputEvent => void,
	label: string,
	maxLength?: number,
	name: string,
	placeholder?: string,
	value: string
};

export type IndicatorBoxProps = $Shape<{|
	children: React$Node,
	name: string,
	renderLeftControl: (set: DataSet, index: number) => React$Node,
	useBreakdown?: boolean
|}>;

export type ParameterBoxProps = $Shape<{|
	children: React$Node,
	name: string,
	useGroup: boolean
|}>;

export type SourceBoxProps = $Shape<{|
	indicatorName: string,
	minCountBuildingSources: number,
	parameterName: string,
	sourceRefFields: Array<string>
|}>;

export type DataBuilderProps = {
	renderBaseBoxes: () => React$Node,
	renderIndicatorBoxes: (props?: IndicatorBoxProps) => React$Node,
	renderParameterBox: (props: ParameterBoxProps) => React$Node,
	renderSourceBox: (props: SourceBoxProps) => React$Node,
	setDataFieldValue: SetDataFieldValue,
	setFieldValue: SetFieldValue,
	values: Values
};

export type Props = {
	render: (props: DataBuilderProps) => React$Node,
	...ParamsTabProps
};
