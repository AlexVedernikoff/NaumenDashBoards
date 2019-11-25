// @flow

// Типы атрибутов
const COMPUTED_ATTR: 'COMPUTED_ATTR' = 'COMPUTED_ATTR';
const DATE = ['date', 'dateTime'];
const INTEGER = ['integer', 'double'];
const OBJECT = ['object', 'boLinks', 'backBOLinks'];
const REF = [...OBJECT, 'catalogItemSet', 'catalogItem'];

const TYPES = {
	COMPUTED_ATTR,
	DATE,
	INTEGER,
	OBJECT,
	REF
};

export default TYPES;
