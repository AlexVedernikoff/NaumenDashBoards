// @flow
const REMOVE_CUSTOM_GROUP: 'REMOVE_CUSTOM_GROUP' = 'REMOVE_CUSTOM_GROUP';
const SAVE_CUSTOM_GROUP: 'SAVE_CUSTOM_GROUP' = 'SAVE_CUSTOM_GROUP';
const SET_CUSTOM_GROUPS: 'SET_CUSTOM_GROUPS' = 'SET_CUSTOM_GROUPS';
const UNKNOWN_CUSTOM_GROUPS_ACTION: 'UNKNOWN_CUSTOM_GROUPS_ACTION' = 'UNKNOWN_CUSTOM_GROUPS_ACTION';

const CUSTOM_GROUPS_EVENTS = {
	REMOVE_CUSTOM_GROUP,
	SAVE_CUSTOM_GROUP,
	SET_CUSTOM_GROUPS,
	UNKNOWN_CUSTOM_GROUPS_ACTION
};

// Типы групп
const DATETIME: 'DATETIME' = 'DATETIME';

const CUSTOM_GROUP_TYPES = {
	DATETIME
};

// Типы данных операндов условий подгрупп
const BETWEEN: 'BETWEEN' = 'BETWEEN';
const LAST: 'LAST' = 'LAST';
const NEAR: 'NEAR' = 'NEAR';
const TODAY: 'TODAY' = 'TODAY';

const CONDITION_TYPES = {
	BETWEEN,
	LAST,
	NEAR,
	TODAY
};

export {
	CONDITION_TYPES,
	CUSTOM_GROUP_TYPES,
	CUSTOM_GROUPS_EVENTS
};
