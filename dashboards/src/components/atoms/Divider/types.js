// @flow
import {VARIANTS} from './constants';

export type Variant =
	| typeof VARIANTS.CHECKBOX
	| typeof VARIANTS.FIELD
	| typeof VARIANTS.SECTION
;

export type Props = {
    variant: Variant
};
