// @flow
export class UndefinedError extends Error {
	constructor (message: string) {
		console.error('An undefined error was created');
		super(message);
	}
}

export class ApiError extends Error {}

export class AttributeIsNull extends ApiError {}

export class ColorsNotContainsInDashboard extends ApiError {}

export class DashboardNotFound extends ApiError {}

export class DashboardSettingsNotSaved extends ApiError {}

export class DrillDownBigData extends ApiError {}

export class EmptyAggregation extends ApiError {}

export class EmptyDashboardCode extends ApiError {}

export class EmptyLayoutSettings extends ApiError {}

export class EmptyRequestData extends ApiError {}

export class EmptySource extends ApiError {}

export class FilterAlreadyExists extends ApiError {}

export class FilterMustNotBeRemoved extends ApiError {}

export class FilterNameNotUnique extends ApiError {}

export class GroupNotContainsInDashboard extends ApiError {}

export class GroupSettingsNull extends ApiError {}

export class GroupTypesDontMatch extends ApiError {}

export class InvalidResultDataSet extends ApiError {}

export class InvalidSource extends ApiError {}

export class LoginMustNotBeNull extends ApiError {}

export class MustNotAddEditWidget extends ApiError {}

export class NoDataForCondition extends ApiError {}

export class NoRightsToRemoveWidget extends ApiError {}

export class NotSuitableAggregationAndAttributeType extends ApiError {}

export class NotSuitableGroupAndAttributeType extends ApiError {}

export class NotSupportedAggregationType extends ApiError {}

export class NotSupportedAttributeType extends ApiError {}

export class NotSupportedAttributeTypeForCustomGroup extends ApiError {}

export class NotSupportedConditionType extends ApiError {}

export class NotSupportedDateFormat extends ApiError {}

export class NotSupportedDiagramType extends ApiError {}

export class NotSupportedDtIntervalGroupType extends ApiError {}

export class NotSupportedFilterCondition extends ApiError {}

export class NotSupportedGroupType extends ApiError {}

export class NotSupportedSortingType extends ApiError {}

export class NotUniqueWidgetName extends ApiError {}

export class PersonalDashboardNotFound extends ApiError {}

export class PersonalSettingsDisabled extends ApiError {}

export class RemoveFilterFailed extends ApiError {}

export class RequisiteIsNotSupported extends ApiError {}

export class SourceNotFound extends ApiError {}

export class SubjectTypeAndAttributeTypeNotEqual extends ApiError {}

export class SuperUserCantResetPersonalDashboard extends ApiError {}

export class UserEmailIsNullOrEmpty extends ApiError {}

export class WidgetNotFound extends ApiError {}

export class WidgetNotRemoved extends ApiError {}

export class WidgetNotSaved extends ApiError {}

export class WidgetSettingsAreEmpty extends ApiError {}

export class WrongArgument extends ApiError {}

export class WrongGroupTypesInCalculation extends ApiError {}
