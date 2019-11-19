// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Option} from 'components/molecules/MiniSelect/types';
import type {OptionType} from 'react-select/src/types';
import type {Select} from 'components/organisms/WidgetFormPanel/types';

export type AttrSelectProps = {
	attr?: boolean,
	options?: Array<Attribute>,
	value: Attribute | null
} & Select;

export type MixinInputProps = {
	[string]: any
};

export type MiniSelectProps = {
	name: string,
	onSelect?: (name: string, value: string) => any,
	options: Array<Option>,
	showCaret?: boolean,
	value: string
}

export type GetRefOptions = (value: OptionType) => Array<OptionType>;
