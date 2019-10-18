// @flow
import type {Attribute} from 'store/sources/attributes/types';

const ATTR_SELECT_PROPS = {
	getOptionLabel: (o: Attribute) => o.title,
	getOptionValue: (o: Attribute) => o.code,
	noOptionsMessage: () => 'Список пуст'
};

const SETTINGS = {
	ATTR_SELECT_PROPS
};

export default SETTINGS;
