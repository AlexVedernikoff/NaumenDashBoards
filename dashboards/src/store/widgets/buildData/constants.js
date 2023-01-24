// @flow
// Используется для разделения лейбла и uuid в значениях метакласса. Необходимо для перехода на список объектов
const SEPARATOR = '#';
// Используется для разделения title и code в значениях метакласса. Необходимо для перехода на список объектов
const TITLE_SEPARATOR = '◀️▶️';

// Настройки для игнорирования лимита получаемых данных по параметру и показателю для построения таблицы
const IGNORE_TABLE_DATA_LIMITS_SETTINGS = {
	breakdown: false,
	parameter: false
};

const BREAKDOWN: 'BREAKDOWN' = 'BREAKDOWN';
const INDICATOR: 'INDICATOR' = 'INDICATOR';
const PARAMETER: 'PARAMETER' = 'PARAMETER';

// Типы колонок таблицы
const COLUMN_TYPES = {
	BREAKDOWN,
	INDICATOR,
	PARAMETER
};

export {
	COLUMN_TYPES,
	IGNORE_TABLE_DATA_LIMITS_SETTINGS,
	SEPARATOR,
	TITLE_SEPARATOR
};
