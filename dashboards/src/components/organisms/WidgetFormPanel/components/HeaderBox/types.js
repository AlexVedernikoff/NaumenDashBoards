// @flow
import type {Header} from 'store/widgets/data/types';
import type {LangType} from 'localization/localize_types';

export type PositionOption = {
	name: string,
	title: LangType,
	value: string
};

export type Props = {
	name: string,
	onChange: (name: string, data: Header) => void,
	value: Header
};
