// @flow
import type {LocalizationParams} from 'localization/types';

export type Props = $Shape<{
	children: string,
	t: (key: string, params?: LocalizationParams) => string,
}>;
