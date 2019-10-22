// @flow
import type {Attribute} from 'store/sources/attributes/types';

const ATTR_PROPS = {
	getOptionLabel: (o: Attribute) => o.title,
	getOptionValue: (o: Attribute) => o.code
};

const DEFAULT_COMPONENTS = {
	DropdownIndicator: null,
	IndicatorSeparator: null
};

const NORMAL: 'normal' = 'normal';
const SMALL: 'small' = 'small';

const SELECT_SIZE = {
	NORMAL,
	SMALL
};

export {
	ATTR_PROPS,
	DEFAULT_COMPONENTS,
	SELECT_SIZE
};
