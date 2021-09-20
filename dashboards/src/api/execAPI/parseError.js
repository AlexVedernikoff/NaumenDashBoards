// @flow
import {
	AttributeIsNull,
	ColorsNotContainsInDashboard,
	DashboardNotFound,
	DashboardSettingsNotSaved,
	DrillDownBigData,
	EmptyAggregation,
	EmptyDashboardCode,
	EmptyLayoutSettings,
	EmptyRequestData,
	EmptySource,
	FilterAlreadyExists,
	FilterNameNotUnique,
	GroupNotContainsInDashboard,
	GroupSettingsNull,
	GroupTypesDontMatch,
	InvalidResultDataSet,
	InvalidSource,
	LoginMustNotBeNull,
	MustNotAddEditWidget,
	NoDataForCondition,
	NoRightsToRemoveWidget,
	NotSuitableAggregationAndAttributeType,
	NotSuitableGroupAndAttributeType,
	NotSupportedAggregationType,
	NotSupportedAttributeType,
	NotSupportedAttributeTypeForCustomGroup,
	NotSupportedConditionType,
	NotSupportedDateFormat,
	NotSupportedDiagramType,
	NotSupportedDtIntervalGroupType,
	NotSupportedFilterCondition,
	NotSupportedGroupType,
	NotSupportedSortingType,
	NotUniqueWidgetName,
	PersonalDashboardNotFound,
	PersonalSettingsDisabled,
	RemoveFilterFailed,
	RequisiteIsNotSupported,
	SourceNotFound,
	SubjectTypeAndAttributeTypeNotEqual,
	SuperUserCantResetPersonalDashboard,
	UndefinedError,
	UserEmailIsNullOrEmpty,
	WidgetNotFound,
	WidgetNotRemoved,
	WidgetNotSaved,
	WidgetSettingsAreEmpty,
	WrongArgument,
	WrongGroupTypesInCalculation
} from 'api/errors';
import {ERRORS} from './constants';
import type {ExecErrorResponse} from 'api/types';

export const parseError = (response: ExecErrorResponse): Error => {
	try {
		const {exceptionType, message} = JSON.parse(response.responseText);

		switch (exceptionType) {
			case ERRORS.ATTRIBUTE_IS_NULL:
				return new AttributeIsNull(message);
			case ERRORS.COLORS_NOT_CONTAINS_IN_DASHBOARD:
				return new ColorsNotContainsInDashboard(message);
			case ERRORS.DASHBOARD_NOT_FOUND:
				return new DashboardNotFound(message);
			case ERRORS.DASHBOARD_SETTINGS_NOT_SAVED:
				return new DashboardSettingsNotSaved(message);
			case ERRORS.DRILL_DOWN_BIG_DATA:
				return new DrillDownBigData(message);
			case ERRORS.EMPTY_AGGREGATION:
				return new EmptyAggregation(message);
			case ERRORS.EMPTY_DASHBOARD_CODE:
				return new EmptyDashboardCode(message);
			case ERRORS.EMPTY_LAYOUT_SETTINGS:
				return new EmptyLayoutSettings(message);
			case ERRORS.EMPTY_REQUEST_DATA:
				return new EmptyRequestData(message);
			case ERRORS.EMPTY_SOURCE:
				return new EmptySource(message);
			case ERRORS.FILTER_ALREADY_EXISTS:
				return new FilterAlreadyExists(message);
			case ERRORS.FILTER_NAME_NOT_UNIQUE:
				return new FilterNameNotUnique(message);
			case ERRORS.GROUP_NOT_CONTAINS_IN_DASHBOARD:
				return new GroupNotContainsInDashboard(message);
			case ERRORS.GROUP_SETTINGS_NULL:
				return new GroupSettingsNull(message);
			case ERRORS.GROUP_TYPES_DONT_MATCH:
				return new GroupTypesDontMatch(message);
			case ERRORS.INVALID_RESULT_DATA_SET:
				return new InvalidResultDataSet(message);
			case ERRORS.INVALID_SOURCE:
				return new InvalidSource(message);
			case ERRORS.LOGIN_MUST_NOT_BE_NULL:
				return new LoginMustNotBeNull(message);
			case ERRORS.MUST_NOT_ADD_EDIT_WIDGET:
				return new MustNotAddEditWidget(message);
			case ERRORS.NO_DATA_FOR_CONDITION:
				return new NoDataForCondition(message);
			case ERRORS.NO_RIGHTS_TO_REMOVE_WIDGET:
				return new NoRightsToRemoveWidget(message);
			case ERRORS.NOT_SUITABLE_AGGREGATION_AND_ATTRIBUTE_TYPE:
				return new NotSuitableAggregationAndAttributeType(message);
			case ERRORS.NOT_SUITABLE_GROUP_AND_ATTRIBUTE_TYPE:
				return new NotSuitableGroupAndAttributeType(message);
			case ERRORS.NOT_SUPPORTED_AGGREGATION_TYPE:
				return new NotSupportedAggregationType(message);
			case ERRORS.NOT_SUPPORTED_ATTRIBUTE_TYPE:
				return new NotSupportedAttributeType(message);
			case ERRORS.NOT_SUPPORTED_ATTRIBUTE_TYPE_FOR_CUSTOM_GROUP:
				return new NotSupportedAttributeTypeForCustomGroup(message);
			case ERRORS.NOT_SUPPORTED_CONDITION_TYPE:
				return new NotSupportedConditionType(message);
			case ERRORS.NOT_SUPPORTED_DATE_FORMAT:
				return new NotSupportedDateFormat(message);
			case ERRORS.NOT_SUPPORTED_DIAGRAM_TYPE:
				return new NotSupportedDiagramType(message);
			case ERRORS.NOT_SUPPORTED_DT_INTERVAL_GROUP_TYPE:
				return new NotSupportedDtIntervalGroupType(message);
			case ERRORS.NOT_SUPPORTED_FILTER_CONDITION:
				return new NotSupportedFilterCondition(message);
			case ERRORS.NOT_SUPPORTED_GROUP_TYPE:
				return new NotSupportedGroupType(message);
			case ERRORS.NOT_SUPPORTED_SORTING_TYPE:
				return new NotSupportedSortingType(message);
			case ERRORS.NOT_UNIQUE_WIDGET_NAME:
				return new NotUniqueWidgetName(message);
			case ERRORS.PERSONAL_DASHBOARD_NOT_FOUND:
				return new PersonalDashboardNotFound(message);
			case ERRORS.PERSONAL_SETTINGS_DISABLED:
				return new PersonalSettingsDisabled(message);
			case ERRORS.FILTER_MUST_NOT_BE_REMOVED:
			case ERRORS.REMOVE_FILTER_FAILED:
				return new RemoveFilterFailed(message);
			case ERRORS.REQUISITE_IS_NOT_SUPPORTED:
				return new RequisiteIsNotSupported(message);
			case ERRORS.SOURCE_NOT_FOUND:
				return new SourceNotFound(message);
			case ERRORS.SUBJECT_TYPE_AND_ATTRIBUTE_TYPE_NOT_EQUAL:
				return new SubjectTypeAndAttributeTypeNotEqual(message);
			case ERRORS.SUPER_USER_CANT_RESET_PERSONAL_DASHBOARD:
				return new SuperUserCantResetPersonalDashboard(message);
			case ERRORS.USER_EMAIL_IS_NULL_OR_EMPTY:
				return new UserEmailIsNullOrEmpty(message);
			case ERRORS.WIDGET_NOT_FOUND:
				return new WidgetNotFound(message);
			case ERRORS.WIDGET_NOT_REMOVED:
				return new WidgetNotRemoved(message);
			case ERRORS.WIDGET_NOT_SAVED:
				return new WidgetNotSaved(message);
			case ERRORS.WIDGET_SETTINGS_ARE_EMPTY:
				return new WidgetSettingsAreEmpty(message);
			case ERRORS.WRONG_ARGUMENT:
				return new WrongArgument(message);
			case ERRORS.WRONG_GROUP_TYPES_IN_CALCULATION:
				return new WrongGroupTypesInCalculation(message);
			default:
				return new UndefinedError(message);
		}
	} catch (e) {
		if (process.env.NODE_ENV === 'development') {
			console.error('parseError: ', e);
		}

		throw response;
	}
};
