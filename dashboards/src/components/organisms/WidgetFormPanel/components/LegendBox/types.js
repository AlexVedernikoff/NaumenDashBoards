// @flow
import type {LangType} from 'localization/localize_types';
import type {Legend} from 'store/widgets/data/types';

export type PositionOption = {
	name: string,
	title: LangType,
	value: string
};

export type Props = {
	name: string,
	onChange: (name: string, value: Legend) => void,
	value: Legend,
};
