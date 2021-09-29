// @flow
import type {Locales, LocalizationParams} from 'localization/types';

export type Props = {
	children: React$Node,
};

export type State = {
	locale: ?Locales,
	translate: ?(key: string, params?: LocalizationParams) => string
};

export type ContextProps = {
	locale: ?Locales,
	translate: ?(key: string, params?: LocalizationParams) => string
}
;
