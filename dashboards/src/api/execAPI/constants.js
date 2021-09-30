// @flow
export const IS_USER_NEEDED_LIST = [
	{method: 'createPersonalDashboard', module: 'dashboardSettings'},
	{method: 'createWidget', module: 'dashboardSettings'},
	{method: 'deleteCustomColors', module: 'dashboardSettings'},
	{method: 'deleteCustomGroup', module: 'dashboardSettings'},
	{method: 'deletePersonalDashboard', module: 'dashboardSettings'},
	{method: 'deleteSourceFilters', module: 'dashboardSettings'},
	{method: 'deleteWidget', module: 'dashboardSettings'},
	{method: 'disableAutoUpdate', module: 'dashboardSettings'},
	{method: 'editLayouts', module: 'dashboardSettings'},
	{method: 'editWidget', module: 'dashboardSettings'},
	{method: 'editWidgetChunkData', module: 'dashboardSettings'},
	{method: 'enableAutoUpdate', module: 'dashboardSettings'},
	{method: 'getAttributesFromLinkAttribute', module: 'dashboards'},
	{method: 'getDashboardLink', module: 'dashboards'},
	{method: 'getDashboardsAndWidgetsTree', module: 'dashboardSettings'},
	{method: 'getDataForCompositeDiagram', module: 'dashboardDataSet'},
	{method: 'getDataForTableDiagram', module: 'dashboardDataSet'},
	{method: 'getLink', module: 'dashboardDrilldown'},
	{method: 'getSettings', module: 'dashboardSettings'},
	{method: 'getUserData', module: 'dashboardSettings'},
	{method: 'saveAutoUpdateSettings', module: 'dashboardSettings'},
	{method: 'saveCustomColors', module: 'dashboardSettings'},
	{method: 'saveCustomGroup', module: 'dashboardSettings'},
	{method: 'saveSourceFilters', module: 'dashboardSettings'},
	{method: 'updateCustomGroup', module: 'dashboardSettings'},
	{method: 'widgetIsBadToCopy', module: 'dashboardSettings'}
];

export const DISABLE_GET_METHOD = [
	{method: 'getTest', module: 'dashboards'}
];

const ATTRIBUTE_IS_NULL: 'attributeIsNull' = 'attributeIsNull';
const COLORS_NOT_CONTAINS_IN_DASHBOARD: 'colorsNotContainsInDashboard' = 'colorsNotContainsInDashboard';
const DASHBOARD_NOT_FOUND: 'dashboardNotFound' = 'dashboardNotFound';
const DASHBOARD_SETTINGS_NOT_SAVED: 'dashboardSettingsNotSaved' = 'dashboardSettingsNotSaved';
const DRILL_DOWN_BIG_DATA: 'drillDownBigData' = 'drillDownBigData';
const EMPTY_AGGREGATION: 'emptyAggregation' = 'emptyAggregation';
const EMPTY_DASHBOARD_CODE: 'emptyDashboardCode' = 'emptyDashboardCode';
const EMPTY_LAYOUT_SETTINGS: 'emptyLayoutSettings' = 'emptyLayoutSettings';
const EMPTY_REQUEST_DATA: 'emptyRequestData' = 'emptyRequestData';
const EMPTY_SOURCE: 'emptySource' = 'emptySource';
const FILTER_ALREADY_EXISTS: 'filterAlreadyExists' = 'filterAlreadyExists';
const FILTER_MUST_NOT_BE_REMOVED: 'filterMustNotBeRemoved' = 'filterMustNotBeRemoved';
const FILTER_NAME_NOT_UNIQUE: 'filterNameNotUnique' = 'filterNameNotUnique';
const GROUP_NOT_CONTAINS_IN_DASHBOARD: 'groupNotContainsInDashboard' = 'groupNotContainsInDashboard';
const GROUP_SETTINGS_NULL: 'groupSettingsNull' = 'groupSettingsNull';
const GROUP_TYPES_DONT_MATCH: 'groupTypesDontMatch' = 'groupTypesDontMatch';
const INVALID_RESULT_DATA_SET: 'invalidResultDataSet' = 'invalidResultDataSet';
const INVALID_SOURCE: 'invalidSource' = 'invalidSource';
const LOGIN_MUST_NOT_BE_NULL: 'loginMustNotBeNull' = 'loginMustNotBeNull';
const MUST_NOT_ADD_EDIT_WIDGET: 'mustNotAddEditWidget' = 'mustNotAddEditWidget';
const NO_DATA_FOR_CONDITION: 'noDataForCondition' = 'noDataForCondition';
const NO_RIGHTS_TO_REMOVE_WIDGET: 'noRightsToRemoveWidget' = 'noRightsToRemoveWidget';
const NOT_SUITABLE_AGGREGATION_AND_ATTRIBUTE_TYPE: 'notSuitableAggregationAndAttributeType' = 'notSuitableAggregationAndAttributeType';
const NOT_SUITABLE_GROUP_AND_ATTRIBUTE_TYPE: 'notSuitableGroupAndAttributeType' = 'notSuitableGroupAndAttributeType';
const NOT_SUPPORTED_AGGREGATION_TYPE: 'notSupportedAggregationType' = 'notSupportedAggregationType';
const NOT_SUPPORTED_ATTRIBUTE_TYPE_FOR_CUSTOM_GROUP: 'notSupportedAttributeTypeForCustomGroup' = 'notSupportedAttributeTypeForCustomGroup';
const NOT_SUPPORTED_ATTRIBUTE_TYPE: 'notSupportedAttributeType' = 'notSupportedAttributeType';
const NOT_SUPPORTED_CONDITION_TYPE: 'notSupportedConditionType' = 'notSupportedConditionType';
const NOT_SUPPORTED_DATE_FORMAT: 'notSupportedDateFormat' = 'notSupportedDateFormat';
const NOT_SUPPORTED_DIAGRAM_TYPE: 'notSupportedDiagramType' = 'notSupportedDiagramType';
const NOT_SUPPORTED_DT_INTERVAL_GROUP_TYPE: 'notSupportedDTIntervalGroupType' = 'notSupportedDTIntervalGroupType';
const NOT_SUPPORTED_FILTER_CONDITION: 'notSupportedFilterCondition' = 'notSupportedFilterCondition';
const NOT_SUPPORTED_GROUP_TYPE: 'notSupportedGroupType' = 'notSupportedGroupType';
const NOT_SUPPORTED_SORTING_TYPE: 'notSupportedSortingType' = 'notSupportedSortingType';
const NOT_UNIQUE_WIDGET_NAME: 'notUniqueWidgetName' = 'notUniqueWidgetName';
const OVERFLOW_DATA: 'overflowData' = 'overflowData';
const PERSONAL_DASHBOARD_NOT_FOUND: 'personalDashboardNotFound' = 'personalDashboardNotFound';
const PERSONAL_SETTINGS_DISABLED: 'personalSettingsDisabled' = 'personalSettingsDisabled';
const REMOVE_FILTER_FAILED: 'removeFilterFailed' = 'removeFilterFailed';
const REQUISITE_IS_NOT_SUPPORTED: 'requisiteIsNotSupported' = 'requisiteIsNotSupported';
const SOURCE_NOT_FOUND: 'sourceNotFound' = 'sourceNotFound';
const SUBJECT_TYPE_AND_ATTRIBUTE_TYPE_NOT_EQUAL: 'subjectTypeAndAttributeTypeNotEqual' = 'subjectTypeAndAttributeTypeNotEqual';
const SUPER_USER_CANT_RESET_PERSONAL_DASHBOARD: 'superUserCantResetPersonalDashboard' = 'superUserCantResetPersonalDashboard';
const USER_EMAIL_IS_NULL_OR_EMPTY: 'userEmailIsNullOrEmpty' = 'userEmailIsNullOrEmpty';
const WIDGET_NOT_FOUND: 'widgetNotFound' = 'widgetNotFound';
const WIDGET_NOT_REMOVED: 'widgetNotRemoved' = 'widgetNotRemoved';
const WIDGET_NOT_SAVED: 'widgetNotSaved' = 'widgetNotSaved';
const WIDGET_SETTINGS_ARE_EMPTY: 'widgetSettingsAreEmpty' = 'widgetSettingsAreEmpty';
const WRONG_ARGUMENT: 'wrongArgument' = 'wrongArgument';
const WRONG_GROUP_TYPES_IN_CALCULATION: 'wrongGroupTypesInCalculation' = 'wrongGroupTypesInCalculation';

export const ERRORS = {
	ATTRIBUTE_IS_NULL,
	COLORS_NOT_CONTAINS_IN_DASHBOARD,
	DASHBOARD_NOT_FOUND,
	DASHBOARD_SETTINGS_NOT_SAVED,
	DRILL_DOWN_BIG_DATA,
	EMPTY_AGGREGATION,
	EMPTY_DASHBOARD_CODE,
	EMPTY_LAYOUT_SETTINGS,
	EMPTY_REQUEST_DATA,
	EMPTY_SOURCE,
	FILTER_ALREADY_EXISTS,
	FILTER_MUST_NOT_BE_REMOVED,
	FILTER_NAME_NOT_UNIQUE,
	GROUP_NOT_CONTAINS_IN_DASHBOARD,
	GROUP_SETTINGS_NULL,
	GROUP_TYPES_DONT_MATCH,
	INVALID_RESULT_DATA_SET,
	INVALID_SOURCE,
	LOGIN_MUST_NOT_BE_NULL,
	MUST_NOT_ADD_EDIT_WIDGET,
	NOT_SUITABLE_AGGREGATION_AND_ATTRIBUTE_TYPE,
	NOT_SUITABLE_GROUP_AND_ATTRIBUTE_TYPE,
	NOT_SUPPORTED_AGGREGATION_TYPE,
	NOT_SUPPORTED_ATTRIBUTE_TYPE,
	NOT_SUPPORTED_ATTRIBUTE_TYPE_FOR_CUSTOM_GROUP,
	NOT_SUPPORTED_CONDITION_TYPE,
	NOT_SUPPORTED_DATE_FORMAT,
	NOT_SUPPORTED_DIAGRAM_TYPE,
	NOT_SUPPORTED_DT_INTERVAL_GROUP_TYPE,
	NOT_SUPPORTED_FILTER_CONDITION,
	NOT_SUPPORTED_GROUP_TYPE,
	NOT_SUPPORTED_SORTING_TYPE,
	NOT_UNIQUE_WIDGET_NAME,
	NO_DATA_FOR_CONDITION,
	NO_RIGHTS_TO_REMOVE_WIDGET,
	OVERFLOW_DATA,
	PERSONAL_DASHBOARD_NOT_FOUND,
	PERSONAL_SETTINGS_DISABLED,
	REMOVE_FILTER_FAILED,
	REQUISITE_IS_NOT_SUPPORTED,
	SOURCE_NOT_FOUND,
	SUBJECT_TYPE_AND_ATTRIBUTE_TYPE_NOT_EQUAL,
	SUPER_USER_CANT_RESET_PERSONAL_DASHBOARD,
	USER_EMAIL_IS_NULL_OR_EMPTY,
	WIDGET_NOT_FOUND,
	WIDGET_NOT_REMOVED,
	WIDGET_NOT_SAVED,
	WIDGET_SETTINGS_ARE_EMPTY,
	WRONG_ARGUMENT,
	WRONG_GROUP_TYPES_IN_CALCULATION
};
