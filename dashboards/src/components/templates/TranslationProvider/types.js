// @flow
import type {LangType} from 'localization/localize_types';
import type {Locales, LocalizationParams} from 'localization/types';

export type Props = {
	children: React$Node,
};

export type WithUtilsProps = {
	locale: ?Locales,
	t: ?(key: LangType, params?: LocalizationParams) => string
};
export type State = {
	locale: ?Locales,
	translate: ?(key: LangType, params?: LocalizationParams) => string
};

export type ContextProps = {
	locale: ?Locales,
	translate: ?(key: LangType, params?: LocalizationParams) => string
};
