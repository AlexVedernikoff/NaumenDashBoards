// @flow
import {OPERAND_TYPES} from 'store/customGroups/constants';

const EQUAL = {
	label: 'равно',
	value: OPERAND_TYPES.EQUAL
};

const NOT_EQUAL = {
	label: 'не равно (и не пусто)',
	value: OPERAND_TYPES.NOT_EQUAL
};

const NOT_EQUAL_NOT_EMPTY = {
	label: 'не равно (включая пустые)',
	value: OPERAND_TYPES.NOT_EQUAL_NOT_EMPTY
};

const GREATER = {
	label: 'больше',
	value: OPERAND_TYPES.GREATER
};

const LESS = {
	label: 'менее',
	value: OPERAND_TYPES.LESS
};

const EMPTY = {
	label: 'пусто',
	value: OPERAND_TYPES.EMPTY
};

const NOT_EMPTY = {
	label: 'не пусто',
	value: OPERAND_TYPES.NOT_EMPTY
};

const CONTAINS = {
	label: 'Содержит',
	value: OPERAND_TYPES.CONTAINS
};

const NOT_CONTAINS = {
	label: 'Не содержит',
	value: OPERAND_TYPES.NOT_CONTAINS
};

const CONTAINS_ANY = {
	label: 'Содержит любое из значений',
	value: OPERAND_TYPES.CONTAINS_ANY
};

const TITLE_CONTAINS = {
	label: 'Название содержит',
	value: OPERAND_TYPES.TITLE_CONTAINS
};

const TITLE_NOT_CONTAINS = {
	label: 'Название не содержит',
	value: OPERAND_TYPES.TITLE_NOT_CONTAINS
};

const CONTAINS_INCLUDING_ARCHIVAL = {
	label: 'Содержит (включая архивные)',
	value: OPERAND_TYPES.CONTAINS_INCLUDING_ARCHIVAL
};

const NOT_CONTAINS_INCLUDING_ARCHIVAL = {
	label: 'Не содержит (включая архивные)',
	value: OPERAND_TYPES.NOT_CONTAINS_INCLUDING_ARCHIVAL
};

const EQUAL_CURRENT_OBJECT = {
	label: 'Равно текущему объекту',
	value: OPERAND_TYPES.EQUAL_CURRENT_OBJECT
};

const EQUAL_ATTR_CURRENT_OBJECT = {
	label: 'Равно атрибуту текущего объекта',
	value: OPERAND_TYPES.EQUAL_ATTR_CURRENT_OBJECT
};

const CONTAINS_INCLUDING_NESTED = {
	label: 'Содержит (включая вложенные)',
	value: OPERAND_TYPES.CONTAINS_INCLUDING_NESTED
};

const CONTAINS_CURRENT_OBJECT = {
	label: 'Содержит текущий объект',
	value: OPERAND_TYPES.CONTAINS_CURRENT_OBJECT
};

const CONTAINS_ATTR_CURRENT_OBJECT = {
	label: 'Содержит атрибут текущего объекта',
	value: OPERAND_TYPES.CONTAINS_ATTR_CURRENT_OBJECT
};

const DATETIME_OPTIONS = [
	{
		label: 'с ...по',
		value: OPERAND_TYPES.BETWEEN
	},
	{
		label: 'за последние "n" дней ',
		value: OPERAND_TYPES.LAST
	},
	{
		label: 'в ближайшие "n" дней',
		value: OPERAND_TYPES.NEAR
	},
	{
		label: 'сегодня',
		value: OPERAND_TYPES.TODAY
	}
];

const INTEGER_OPTIONS = [
	EQUAL,
	NOT_EQUAL,
	NOT_EQUAL_NOT_EMPTY,
	GREATER,
	LESS,
	EMPTY,
	NOT_EMPTY
];

const OBJECT_OPTIONS = [
	CONTAINS,
	NOT_CONTAINS,
	CONTAINS_ANY,
	TITLE_CONTAINS,
	TITLE_NOT_CONTAINS,
	EMPTY,
	NOT_EMPTY,
	CONTAINS_INCLUDING_ARCHIVAL,
	NOT_CONTAINS_INCLUDING_ARCHIVAL,
	EQUAL_CURRENT_OBJECT,
	EQUAL_ATTR_CURRENT_OBJECT
];

const BO_LINKS_OPTIONS = [
	CONTAINS,
	NOT_CONTAINS,
	TITLE_CONTAINS,
	TITLE_NOT_CONTAINS,
	EMPTY,
	NOT_EMPTY,
	CONTAINS_INCLUDING_ARCHIVAL,
	NOT_CONTAINS_INCLUDING_ARCHIVAL,
	CONTAINS_INCLUDING_NESTED,
	CONTAINS_CURRENT_OBJECT,
	CONTAINS_ATTR_CURRENT_OBJECT
];

const BACK_BO_LINKS_OPTIONS = [
	CONTAINS,
	NOT_CONTAINS,
	TITLE_CONTAINS,
	TITLE_NOT_CONTAINS,
	EMPTY,
	NOT_EMPTY,
	CONTAINS_INCLUDING_ARCHIVAL,
	NOT_CONTAINS_INCLUDING_ARCHIVAL,
	CONTAINS_CURRENT_OBJECT,
	CONTAINS_ATTR_CURRENT_OBJECT
];

const CATALOG_ITEM_OPTIONS = [
	CONTAINS,
	NOT_CONTAINS,
	CONTAINS_ANY,
	TITLE_CONTAINS,
	TITLE_NOT_CONTAINS,
	EMPTY,
	NOT_EMPTY,
	EQUAL_CURRENT_OBJECT
];

const CATALOG_ITEM_SET_OPTIONS = [
	CONTAINS,
	NOT_CONTAINS,
	TITLE_CONTAINS,
	TITLE_NOT_CONTAINS,
	EMPTY,
	NOT_EMPTY,
	CONTAINS_ATTR_CURRENT_OBJECT
];

const AGGREGATE_AND_RESPONSIBLE_OPTIONS = [
	CONTAINS,
	NOT_CONTAINS,
	CONTAINS_ANY,
	TITLE_CONTAINS,
	TITLE_NOT_CONTAINS,
	EMPTY,
	NOT_EMPTY,
	EQUAL_CURRENT_OBJECT,
	EQUAL_ATTR_CURRENT_OBJECT
];

const META_CLASS_AND_STATE_OPTIONS = [
	CONTAINS,
	NOT_CONTAINS,
	CONTAINS_ANY,
	TITLE_CONTAINS,
	TITLE_NOT_CONTAINS,
	EQUAL_ATTR_CURRENT_OBJECT
];

export {
	AGGREGATE_AND_RESPONSIBLE_OPTIONS,
	BACK_BO_LINKS_OPTIONS,
	BO_LINKS_OPTIONS,
	CATALOG_ITEM_OPTIONS,
	CATALOG_ITEM_SET_OPTIONS,
	DATETIME_OPTIONS,
	INTEGER_OPTIONS,
	META_CLASS_AND_STATE_OPTIONS,
	OBJECT_OPTIONS
};
