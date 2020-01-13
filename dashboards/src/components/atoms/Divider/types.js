// @flow
import {VARIANTS} from './constants';

export type Variant =
	| typeof VARIANTS.CHECKBOX
	| typeof VARIANTS.FIELD
	| typeof VARIANTS.SECTION
	| typeof VARIANTS.SIMPLE
;

export type Props = {
    variant: Variant
};
