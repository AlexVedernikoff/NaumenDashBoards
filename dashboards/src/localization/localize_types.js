// @flow

// components/atoms/InfoPanel
type InfoPanel =
	| 'InfoPanel::onConfirm'
	| 'InfoPanel::Attention';

// components/atoms/SearchInput
type SearchInput =
	| 'SearchInput::Placeholder';

// components/atoms/TextArea
type TextArea =
	| 'TextArea::Placeholder'
	| 'TextArea::Clear';

// components/molecules/Chart
type Chart =
	| 'Chart::CountTotals';

// components/molecules/ColorPicker
type ColorPicker =
	| 'ColorPicker::Apply'
	| 'ColorPicker::Cancel';

// components/molecules/Datepicker
type Datepicker =
	| 'Datepicker::Mon'
	| 'Datepicker::Tue'
	| 'Datepicker::Wed'
	| 'Datepicker::Thu'
	| 'Datepicker::Fri'
	| 'Datepicker::Sat'
	| 'Datepicker::Sun';

type DTIntervalFormat =
	| 'DTIntervalFormat::Day'
	| 'DTIntervalFormat::Hours'
	| 'DTIntervalFormat::Minutes'
	| 'DTIntervalFormat::NotSelect'
	| 'DTIntervalFormat::QuotientPart'
	| 'DTIntervalFormat::RemainderPart'
	| 'DTIntervalFormat::Seconds'
	| 'DTIntervalFormat::SymbolCount'
	| 'DTIntervalFormat::Week';

// components/molecules/Kebab
type Kebab =
	| 'Kebab::Menu';

// components/molecules/MaterialSelect/components/MultiValueContainer
type MultiValueContainer =
	| 'MultiValueContainer::Clear'
	| 'MultiValueContainer::AndMore'
	| 'MultiValueContainer::ShowAll';

// components/molecules/MiniSelect
type MiniSelect =
	| 'MiniSelect::NoSelect';

// components/molecules/Modal
type Modal =
	| 'Modal::Cancel'
	| 'Modal::Save';

// components/molecules/MultiDropDownList
type MultiDropDownList =
	| 'MultiDropDownList::EmptyMessage';

// components/molecules/ParameterFormatPanel/components/LabelParameterFormat
type LabelParameterFormat =
	| 'LabelParameterFormat::Title'
	| 'LabelParameterFormat::Code'
	| 'LabelParameterFormat::TitleCode'
	| 'LabelParameterFormat::FieldLabel';

// components/molecules/ParameterFormatPanel/components/NumberParameterFormat
type NumberParameterFormat =
	| 'NumberParameterFormat::AdditionalOptionsUndefined'
	| 'NumberParameterFormat::Additional'
	| 'NumberParameterFormat::AdditionalOptions'
	| 'NumberParameterFormat::NumberFormat'
	| 'NumberParameterFormat::SplitDigits'
	| 'NumberParameterFormat::SymbolsAfterComma';

// components/molecules/Select
type Select =
	| 'Select::LoadingMessage'
	| 'Select::NoOptionsMessage'
	| 'Select::NotFoundMessage';

// components/molecules/Select/components/List
type SelectList =
	|'Select::List::ShowMore';

// components/molecules/Select/components/List
type SelectModal =
	| 'SelectModal::CreateField'
	| 'SelectModal::Cancel';

// components/molecules/SelectWithCustomEdit
type SelectWithCustomEdit =
	| 'SelectWithCustomEdit::UserOption';

// components/molecules/TreeSelect
type TreeSelect =
	| 'TreeSelect::DefaultPlaceholder';

// components/molecules/TreeSelect/components/Node
type TreeSelectNode =
	| 'TreeSelectNode::ShowMore';

// components/molecules/TreeSelect/components/Tree
type Tree =
	| 'Tree::ListEmpty'
	| 'Tree::ShowMore';

// components/organisms/AttributeCreatingModal/components/SourceControlTree
type SourceControlTree =
	| 'SourceControlTree::AddConstants'
	| 'SourceControlTree::Find'
	| 'SourceControlTree::Contains';

// components/organisms/AttributeCreatingModal/components/SourceControl
type SourceControl =
	| 'SourceControl::Aggregation';

// components/organisms/AutoUpdateButton
type AutoUpdateButton =
	| 'AutoUpdateButton::Apply'
	| 'AutoUpdateButton::AutoRefreshOn'
	| 'AutoUpdateButton::AutoRefreshOff'
	| 'AutoUpdateButton::DiagramAutoRefresh'
	| 'AutoUpdateButton::ErrorMessage'
	| 'AutoUpdateButton::Minutes';

// components/organisms/AxisChartWidgetForm/components/AxisSettingsBox
type AxisSettingsBox =
	| 'AxisSettingsBox::Axis'
	| 'AxisSettingsBox::AxisName';

// components/organisms/AxisChartWidgetForm/components/StyleTab
type AxisChartStyleTab =
	| 'AxisChartStyleTab::Parameter'
	| 'AxisChartStyleTab::Indicator';

// components/organisms/ComboChartWidgetForm/components/IndicatorSettingsBox
type IndicatorSettingsBox =
	| 'IndicatorSettingsBox::ShowDependent'
	| 'IndicatorSettingsBox::Indicator'
	| 'IndicatorSettingsBox::ShowAxis'
	| 'IndicatorSettingsBox::ShowName'
	| 'IndicatorSettingsBox::ConfigureAxis';

// components/organisms/ComboChartWidgetForm/components/ParamsTab
type ComboChartParamsTab =
	| 'ComboChartParamsTab::GraphType';

// components/organisms/ComboChartWidgetForm/components/StyleTab
type ComboChartStyleTab =
	| 'ComboChartStyleTab::Parameter';

type AttributeCreatingModal =
	| 'AttributeCreatingModal::FieldName'
	| 'AttributeCreatingModal::Save'
	| 'AttributeCreatingModal::Cancel'
	| 'AttributeCreatingModal::Delete'
	| 'AttributeCreatingModal::FormulaError'
	| 'AttributeCreatingModal::OldFormat'
	| 'AttributeCreatingModal::Confirm'
	| 'AttributeCreatingModal::CreateField';

// components/organisms/DashboardHeader
type DashboardHeader =
	| 'DashboardHeader::Common'
	| 'DashboardHeader::DeleteConfirmation'
	| 'DashboardHeader::DeleteYourPersonalDashboard'
	| 'DashboardHeader::Delete'
	| 'DashboardHeader::Download'
	| 'DashboardHeader::Edit'
	| 'DashboardHeader::MobileSwitch'
	| 'DashboardHeader::No'
	| 'DashboardHeader::Personal'
	| 'DashboardHeader::RefreshWidgets'
	| 'DashboardHeader::SaveYourself'
	| 'DashboardHeader::View'
	| 'DashboardHeader::WebSwitch'
	| 'DashboardHeader::Yes'
	| 'DashboardHeader::CollapseTopPanel'
	| 'DashboardHeader::ExpandTopPanel';

// components/organisms/DashboardHeader/components/ExportByEmailButton
type ExportByEmailButton =
	| 'ExportByEmailButton::SendToEmail';

// components/organisms/DashboardPanel
type DashboardPanel =
	| 'DashboardPanel::LoadingContent';

// components/organisms/DiagramWidget/components/LoadingContent
type LoadingContent =
 | 'LoadingContent::Loading'
 | 'LoadingContent::Empty';

// components/organisms/ExportByEmailForm/components/FormFooter
type ExportByEmailFormFormFooter =
	| 'ExportByEmailForm::FormFooter::Reset'
	| 'ExportByEmailForm::FormFooter::Send';

// components/organisms/ExportByEmailForm/components/FormHeader
type ExportByEmailFormFormHeader =
	| 'ExportByEmailForm::FormHeader::AddRecipient';

// components/organisms/ExportByEmailForm/components/UserField
type ExportByEmailFormUserField =
	| 'ExportByEmailForm::UserField::DeleteRecipient';

// components/organisms/GroupModal
type GroupModalScheme =
	| 'GroupModal::scheme::NotEmpty'
	| 'GroupModal::scheme::EnterValue'
	| 'GroupModal::scheme::FloatField'
	| 'GroupModal::scheme::IntField'
	| 'GroupModal::scheme::DateRangeField'
	| 'GroupModal::FieldName'
	| 'GroupModal::SystemGroup'
	| 'GroupModal::CustomGroup'
	| 'GroupModal::GroupConfig'
	| 'GroupModal::GroupType';

// components/organisms/GroupModal/components/AndCondition
type AndCondition =
	| 'AndCondition::And';

// components/organisms/GroupModal/components/CustomGroup
type CustomGroup =
	| 'CustomGroup::MaxCount'
	| 'CustomGroup::DeleteConfirmation'
	| 'CustomGroup::ChangeConfirmation'
	| 'CustomGroup::ConfigurationGroup'
	| 'CustomGroup::UsedInWidgets';

// components/organisms/GroupModal/components/CustomGroupSelect
type CustomGroupSelect =
	| 'CustomGroupSelect::NameForSave'
	| 'CustomGroupSelect::AddGroup'
	| 'CustomGroupSelect::DeleteGroup'
	| 'CustomGroupSelect::GroupName'

	// components/organisms/GroupModal/components/IntervalOrCondition
	| 'IntervalOrCondition::Seconds'
	| 'IntervalOrCondition::Minutes'
	| 'IntervalOrCondition::Hours'
	| 'IntervalOrCondition::Days'
	| 'IntervalOrCondition::Weeks'

	// components/organisms/GroupModal/components/MultipleIntervalOrCondition
	| 'IntervalOrCondition::Seconds'
	| 'IntervalOrCondition::Minutes'
	| 'IntervalOrCondition::Hours'
	| 'IntervalOrCondition::Days'
	| 'IntervalOrCondition::Weeks';

// components/organisms/GroupModal/components/OrConditionControl
type OrConditionControl =
	| 'OrConditionControl::OR';

// components/organisms/GroupModal/components/SubGroup
type SubGroup =
	| 'SubGroup::GroupLabel'
	| 'SubGroup::GroupName';

// components/organisms/GroupModal/components/SubGroupSection
type SubGroupSection =
	| 'SubGroupSection::AddGroup';

// components/organisms/GroupModal/components/SystemDateGroupFormat
type SystemDateGroupFormat =
	| 'SystemDateGroupFormat::ChoiceValue';

// components/organisms/GroupModal/components/SystemGroup
type SystemGroup =
	| 'SystemGroup::Format';

// components/organisms/SpeedometerWidgetForm
type SpeedometerWidgetForm =
	| 'SpeedometerWidgetForm::RequiredMessage'
	| 'SpeedometerWidgetForm::ValueRequiredMessage'
	| 'SpeedometerWidgetForm::RequiredAttributeMessage'
	| 'SpeedometerWidgetForm::MinMaxMessage';

// components/organisms/SpeedometerWidgetForm/components/BorderFieldSet
type BorderFieldSet =
	| 'BorderFieldSet::UseNumericValue'
	| 'BorderFieldSet::ScaleBoundaries'
	| 'BorderFieldSet::Minimum'
	| 'BorderFieldSet::Maximum';

// components/organisms/SpeedometerWidgetForm/components/BorderStyleBox
type BorderStyleBox =
	| 'BorderStyleBox::ScaleLimitsSignature';

// components/organisms/SpeedometerWidgetForm/components/RangeField
type BorderRangeField =
	| 'BorderRangeField::Delete';

// components/organisms/SpeedometerWidgetForm/components/RangesFieldset
type BordersRangesFieldset =
	| 'BordersRangesFieldset::Ranges'
	| 'BordersRangesFieldset::UseRanges'
	| 'BordersRangesFieldset::Add';

// components/organisms/SpeedometerWidgetForm/components/RangesStyleBox
type BordersRangesStyleBox =
	| 'BordersRangesStyleBox::Range'
	| 'BordersRangesStyleBox::OnArc'
	| 'BordersRangesStyleBox::InLegend';

// components/organisms/SpeedometerWidgetForm/components/RangesTypeFieldset
type BordersRangesTypeFieldset =
	| 'BordersRangesTypeFieldset::Percent'
	| 'BordersRangesTypeFieldset::Absolute'
	| 'BordersRangesTypeFieldset::RangeType';

// components/organisms/Startup
type Startup =
	| 'Startup::Loading';

// components/organisms/SummaryWidgetForm/components/IndicatorBox
type SummaryWidgetFormIndicatorBox =
	| 'SummaryWidgetForm::IndicatorBox::Indicator'
	| 'SummaryWidgetForm::IndicatorBox::Font';

// components/organisms/Table
type Table =
	| 'Table::Loading'
	| 'Table::EmptyData';

// components/organisms/Table/components/Pagination
type TablePaginator =
	| 'Table::Paginator::PageNumber'
	| 'Table::Paginator::Next'
	| 'Table::Paginator::Previous';

// components/organisms/Table/components/Total
type TableTotal =
	| 'Table::Total::Total';

// components/organisms/TableWidget
type TableWidget =
	| 'TableWidget::ColumnsLimit'
	| 'TableWidget::ValueCountLimit'
	| 'TableWidget::EmptyValue';

// components/organisms/TableWidget/components/ValueWithLimitWarning
type ValueWithLimitWarning =
	| 'ValueWithLimitWarning::ModalNo'
	| 'ValueWithLimitWarning::ModalYes'
	| 'ValueWithLimitWarning::ModalHeader'
	| 'ValueWithLimitWarning::InfoTitle';

// components/organisms/TableWidgetForm
type TableWidgetFormScheme =
	| 'TableWidgetForm::Scheme::DoubleAttribute'
	| 'TableWidgetForm::Scheme::WrongSource';

// components/organisms/TableWidgetForm/components/BodySettingsBox
type TableWidgetFormBodySettingsBox =
	| 'TableWidgetForm::BodySettingsBox::AligningData'
	| 'TableWidgetForm::BodySettingsBox::CollapseGroup'
	| 'TableWidgetForm::BodySettingsBox::EmptyData'
	| 'TableWidgetForm::BodySettingsBox::IndicatorStyle'
	| 'TableWidgetForm::BodySettingsBox::ParameterStyle'
	| 'TableWidgetForm::BodySettingsBox::RowCountLimit'
	| 'TableWidgetForm::BodySettingsBox::ShowDash'
	| 'TableWidgetForm::BodySettingsBox::ShowEmptyString'
	| 'TableWidgetForm::BodySettingsBox::ShowNull'
	| 'TableWidgetForm::BodySettingsBox::ShowRowNumber'
	| 'TableWidgetForm::BodySettingsBox::ShowZero'
	| 'TableWidgetForm::BodySettingsBox::TableBody'
	| 'TableWidgetForm::BodySettingsBox::Wrap';

// components/organisms/TableWidgetForm/components/HeaderSettingsBox
type TableWidgetFormHeaderSettingsBox =
	'TableWidgetForm::HeaderSettingsBox::TableHead';

// components/organisms/TableWidgetForm/components/IndicatorsBox
type TableWidgetFormIndicatorsBox =
	'TableWidgetForm::IndicatorsBox::Indicators';

// components/organisms/TableWidgetForm/components/ParametersBox
type TableWidgetFormParametersBox =
	| 'TableWidgetForm::ParametersBox::Parameters';

// components/organisms/TableWidgetForm/components/SingleRowDataSetSettings
type TableWidgetFormSingleRowDataSetSettings =
	| 'TableWidgetForm::SingleRowDataSetSettings::SourceRowName'
	| 'TableWidgetForm::SingleRowDataSetSettings::SourceRowNamePlaceholder';

// components/organisms/TableWidgetForm/components/ParamsTab
type TableWidgetFormParamsTab =
	| 'TableWidgetForm::ParamsTab::ShowBlankValues'
	| 'TableWidgetForm::ParamsTab::CalculateTotal'
	| 'TableWidgetForm::ParamsTab::ConfirmClearSourcesHeader'
	| 'TableWidgetForm::ParamsTab::ConfirmClearSourcesText';

// components/organisms/TableWidgetForm/components/TableBox
type TableWidgetFormTableBox =
	| 'TableWidgetForm::TableBox::Table';

// components/organisms/PivotWidgetForm
type PivotWidgetForm =
	| 'PivotWidgetForm::GroupingIndicators'
	| 'PivotWidgetForm::Indicators'
	| 'PivotWidgetForm::ParameterRowColor'
	| 'PivotWidgetForm::PivotStyleBox'
	| 'PivotWidgetForm::SourceLinksBox'
	| 'PivotWidgetForm::SourceLinkAttributeEmpty';

type PivotWidgetFormGroupingBox =
	| 'PivotWidgetForm::GroupingBox::Delete'
	| 'PivotWidgetForm::GroupingBox::Group'
	| 'PivotWidgetForm::GroupingBox::Name'
	| 'PivotWidgetForm::GroupingBox::Sum';

type PivotWidgetFormIndicatorsGroupBox =
	| 'PivotWidgetForm::IndicatorsGroupBox::Breakdown'
	| 'PivotWidgetForm::IndicatorsGroupBox::Indicator'
	| 'PivotWidgetForm::IndicatorsGroupBox::NewGroup'
	| 'PivotWidgetForm::IndicatorsGroupBox::CreateGroup'
	| 'PivotWidgetForm::IndicatorsGroupBox::Save'
	| 'PivotWidgetForm::IndicatorsGroupBox::Cancel'
	| 'PivotWidgetForm::IndicatorsGroupBox::IndicatorGrouping';

type PivotWidgetFormSourceLinkEditor =
	| 'PivotWidgetForm::SourceLinkEditor::Save'
	| 'PivotWidgetForm::SourceLinkEditor::Cancel'
	| 'PivotWidgetForm::SourceLinkEditor::SelectSources'
	| 'PivotWidgetForm::SourceLinkEditor::LinkAttribute'
	| 'PivotWidgetForm::SourceLinkEditor::Source1'
	| 'PivotWidgetForm::SourceLinkEditor::Source2';

type SourcesAndFieldsExtended =
	| 'SourcesAndFieldsExtended::ParameterSelection'
	| 'SourcesAndFieldsExtended::IndicatorSelection'
	| 'SourcesAndFieldsExtended::SourceParameter'
	| 'SourcesAndFieldsExtended::Parameter';

type PivotWidget =
	| 'PivotWidget::HideChildren'
	| 'PivotWidget::ShowChildren'
	| 'PivotWidget::Sum'
	| 'PivotWidget::Total';

// components/organisms/TextWidgetForm
type TextWidgetForm =
	| 'TextWidgetForm::DisplayMode'
	| 'TextWidgetForm::DisplayModePlaceholder'
	| 'TextWidgetForm::Text';

// components/organisms/TextWidgetForm/components/StyleBox
type TextWidgetFormStyleBox =
	| 'TextWidgetForm::StyleBox::Bold'
	| 'TextWidgetForm::StyleBox::Italic'
	| 'TextWidgetForm::StyleBox::Underline'
	| 'TextWidgetForm::StyleBox::Font';

/// components/organisms/TableWidgetForm/components/TableTooltipForm
type TableWidgetFormTableTooltipForm =
	| 'TableWidgetForm::TableTooltipForm::Indicator'
	| 'TableWidgetForm::TableTooltipForm::TooltipText'
	| 'TableWidgetForm::TableTooltipForm::AddTooltip'
	| 'TableWidgetForm::TableTooltipForm::AtIndicator'
	| 'TableWidgetForm::TableTooltipForm::AtTitle'
	| 'TableWidgetForm::TableTooltipForm::Tooltip';

// components/organisms/Widget
type Widget =
	| 'Widget::Error';

// components/organisms/Widget/components/WidgetKebab
type WidgetKebab =
	| 'WidgetKebab::Edit'
	| 'WidgetKebab::Delete';

// components/organisms/WidgetAddPanel
type WidgetAddPanel =
	| 'WidgetAddPanel::AddText'
	| 'WidgetAddPanel::AddWidget'
	| 'WidgetAddPanel::CopyWidget'
	| 'WidgetAddPanel::CopyWidgetTitle';

type WidgetCopyPanel =
	| 'WidgetCopyPanel::OrChoiceVariant'
	| 'WidgetCopyPanel::NoFullCopy'
	| 'WidgetCopyPanel::NoReferenceAndUserGroupCopy'
	| 'WidgetCopyPanel::NoReferenceCopy'
	| 'WidgetCopyPanel::NoUserGroupCopy'
	| 'WidgetCopyPanel::Confirm'
	| 'WidgetCopyPanel::Cancel';

// components/organisms/WidgetFormPanel
type WidgetFormPanel =
	| 'WidgetFormPanel::FormError';

// components/organisms/WidgetFormPanel/components/AttributeAggregationField
type AttributeAggregationField =
	| 'AttributeAggregationField::Aggregation';

// components/organisms/WidgetFormPanel/components/AttributeFieldset/components/AttributeSelect
type AttributeSelect =
	| 'AttributeSelect::Empty';

// components/organisms/WidgetFormPanel/components/AttributeFieldset/components/MainSelectList
type MainSelectList =
	| 'MainSelectList::DynamicAttributesError'
	| 'MainSelectList::DynamicAttributes';

// components/organisms/WidgetFormPanel/components/AttributeFieldset/components/TimerValueListOptionValue
type TimerValueListOptionValue =
	| 'TimerValueListOptionValue::Status'
	| 'TimerValueListOptionValue::Value';

// components/organisms/WidgetFormPanel/components/AttributeGroupField
type AttributeGroupField =
	| 'AttributeGroupField::Group';

// components/organisms/WidgetFormPanel/components/BreakdownFieldset
type BreakdownFieldset =
	| 'BreakdownFieldset::Breakdown';

// components/organisms/WidgetFormPanel/components/BreakdownFormat
type BreakdownFormat =
	| 'BreakdownFormat::Breakdown';

// components/organisms/WidgetFormPanel/components/ChartDataSetSettings
type ChartDataSetSettings =
	| 'ChartDataSetSettings::ShowEmptyData'
	| 'ChartDataSetSettings::ShowZeroValues';

// components/organisms/WidgetFormPanel/components/ColorsBox
type ColorsBox =
	| 'ColorsBox::ClearButton'
	| 'ColorsBox::ClearButtonTooltip'
	| 'ColorsBox::Automatically'
	| 'ColorsBox::Manually'
	| 'ColorsBox::ColorsOfChart';

// components/organisms/WidgetFormPanel/components/ColorsBox/components/CustomColorsSettings
type CustomColorsSettings =
	| 'CustomColorsSettings::ApplyForAllWidgets';

// components/organisms/WidgetFormPanel/components/ColorsBox/components/CustomLabelColorsSettings
type CustomLabelColorsSettings =
	| 'CustomLabelColorsSettings::Add'
	| 'CustomLabelColorsSettings::AllParameters';

// components/organisms/WidgetFormPanel/components/ComputedAttributeEditor
type ComputedAttributeEditor =
	| 'ComputedAttributeEditor::EditField';

// components/organisms/WidgetFormPanel/components/DataLabelsBox
type DataLabelsBox =
	| 'DataLabelsBox::DataLabels'
	| 'DataLabelsBox::DataLabelsDisabled'
	| 'DataLabelsBox::Shadow'
	| 'DataLabelsBox::UnitsMeasurement';

// components/organisms/WidgetFormPanel/components/DataTopField
type DataTopField =
	| 'DataTopField::Max'
	| 'DataTopField::Min'
	| 'DataTopField::ShowTop';

// components/organisms/WidgetFormPanel/components/DisplayModeSelectBox
type DisplayModeSelectBox =
	| 'DisplayModeSelectBox::DisplayMode'
	| 'DisplayModeSelectBox::DisplayInMobile';

// components/organisms/WidgetFormPanel/components/FiltersOnWidget
type FiltersOnWidget =
	| 'FiltersOnWidget::FilterOnWidget';

// components/organisms/WidgetFormPanel/components/FiltersOnWidget/components/FilterItem
type FiltersOnWidgetFilterItem =
	| 'FiltersOnWidget::FilterItem::Attribute'
	| 'FiltersOnWidget::FilterItem::AttributePlaceholder'
	| 'FiltersOnWidget::FilterItem::Source'
	| 'FiltersOnWidget::FilterItem::SourcePlaceholder';

// components/organisms/WidgetFormPanel/components/FontStyleControl
type FontStyleControl =
	| 'FontStyleControl::Bold'
	| 'FontStyleControl::Italic'
	| 'FontStyleControl::Underline';

// components/organisms/WidgetFormPanel/components/HeaderBox
type HeaderBox =
	| 'HeaderBox::PositionTop'
	| 'HeaderBox::PositionBottom'
	| 'HeaderBox::Title';

// components/organisms/WidgetFormPanel/components/IndicatorFieldset
type IndicatorFieldset =
	| 'IndicatorFieldset::Aggregation'
	| 'IndicatorFieldset::CreateField'
	| 'IndicatorFieldset::MathFormula'
	| 'IndicatorFieldset::SourcePercentageRelative'
	| 'IndicatorFieldset::SourcePercentageRelativeField' ;

// components/organisms/WidgetFormPanel/components/IndicatorsBox
type IndicatorsBox =
	| 'IndicatorsBox::Indicator';

// components/organisms/WidgetFormPanel/components/LegendBox
type LegendBox =
	| 'LegendBox::PositionLeft'
	| 'LegendBox::PositionTop'
	| 'LegendBox::PositionRight'
	| 'LegendBox::PositionBottom'
	| 'LegendBox::Column'
	| 'LegendBox::Row'
	| 'LegendBox::Title';

// components/organisms/WidgetFormPanel/components/NavigationBox
type NavigationBox =
	| 'NavigationBox::SelectPlaceholder'
	| 'NavigationBox::ShowTip'
	| 'NavigationBox::Title';

// components/organisms/WidgetFormPanel/components/ParametersDataBox
type ParametersDataBox =
	| 'ParametersDataBox::Parameter';

// components/organisms/WidgetFormPanel/components/SavedFilters
type SavedFilters =
	| 'SavedFilters::Title'
	| 'SavedFilters::HeaderMessage'
	| 'SavedFilters::NotFoundMessage'
	| 'SavedFilters::Placeholder';

// components/organisms/WidgetFormPanel/components/ShowTotalAmountBox
type ShowTotalAmountBox =
	| 'ShowTotalAmountBox::ShowSubTotalAmount'
	| 'ShowTotalAmountBox::ShowTotalAmount';

// components/organisms/WidgetFormPanel/components/SortingBox
type SortingBox =
	| 'SortingBox::SortingByDefault'
	| 'SortingBox::SortingByParameter'
	| 'SortingBox::SortingByIndicator'
	| 'SortingBox::SortingDesc'
	| 'SortingBox::SortingAsc'
	| 'SortingBox::Title';

// components/organisms/WidgetFormPanel/components/SourceBox
type SourceBox =
	| 'SourceBox::Title';

// components/organisms/WidgetFormPanel/components/SourceFieldset
type SourceFieldset =
	| 'SourceFieldset::ChangeFilterDuplicate'
	| 'SourceFieldset::SourceRowNameCheckbox'
	| 'SourceFieldset::DeleteSavedFilterError'
	| 'SourceFieldset::ConfirmFilterTitle'
	| 'SourceFieldset::ConfirmFilterMessage'
	| 'SourceFieldset::ComputeCheckbox'
	| 'SourceFieldset::RemoveButton'
	| 'SourceFieldset::SourceSelectLabel'
	| 'SourceFieldset::SaveButton';

// components/organisms/WidgetFormPanel/components/TextAlignControl
type TextAlignControl =
	| 'TextAlignControl::AlignLeft'
	| 'TextAlignControl::AlignCenter'
	| 'TextAlignControl::AlignRight';

// components/organisms/WidgetFormPanel/components/TextHandlerControl
type TextHandlerControl =
	| 'TextHandlerControl::Crop'
	| 'TextHandlerControl::Wrap';

// components/organisms/WidgetFormPanel/components/WidgetNameBox
type WidgetNameBox =
	| 'WidgetNameBox::DiagramName'
	| 'WidgetNameBox::NameField'
	| 'WidgetNameBox::UseName';

// components/organisms/WidgetFormPanel/components/WidgetSelectBox
type WidgetSelectBox =
	| 'WidgetSelectBox::BarChart'
	| 'WidgetSelectBox::ColumnChart'
	| 'WidgetSelectBox::ComboChart'
	| 'WidgetSelectBox::DonutChart'
	| 'WidgetSelectBox::LineChart'
	| 'WidgetSelectBox::PieChart'
	| 'WidgetSelectBox::Pivot'
	| 'WidgetSelectBox::Speedometer'
	| 'WidgetSelectBox::StackedBarChart'
	| 'WidgetSelectBox::StackedColumnChart'
	| 'WidgetSelectBox::Summary'
	| 'WidgetSelectBox::Table'
	| 'WidgetSelectBox::Title';

// components/organisms/WidgetsGrid
type WidgetsGrid =
	| 'WidgetsGrid::ConfirmCloseWindow'
	| 'WidgetsGrid::ContextMenuCreateText'
	| 'WidgetsGrid::ContextMenuCreateWidget'
	| 'WidgetsGrid::EmptyGridAction'
	| 'WidgetsGrid::EmptyGridPart1'
	| 'WidgetsGrid::EmptyGridPart2'
	| 'WidgetsGrid::EmptyMobileMessage'
	| 'WidgetsGrid::Loading';

// components/templates/WidgetForm
type WidgetForm =
	| 'WidgetForm::Save'
	| 'WidgetForm::Cancel';

// components/organisms/WidgetForm/components/ChoiceWidgetTooltipForm
type WidgetFormChoiceWidgetTooltipForm =
	| 'WidgetForm::ChoiceWidgetTooltipForm::AtIndicator'
	| 'WidgetForm::ChoiceWidgetTooltipForm::AtTitle'
	| 'WidgetForm::ChoiceWidgetTooltipForm::Tooltip';

// components/organisms/WidgetForm/components/SimpleWidgetTooltipForm/SimpleWidgetTooltipForm
type WidgetFormSimpleWidgetTooltipForm =
	| 'WidgetForm::SimpleWidgetTooltipForm::Tooltip'
	| 'WidgetForm::SimpleWidgetTooltipForm::TooltipAtTitle';

type WidgetTooltip =
 | 'WidgetTooltip::DefaultHeader';

// containers/DashboardPanel
type DashboardPanelContainers =
	| 'DashboardPanel::Back'
	| 'DashboardPanel::ConfirmCancelWidgetCreateText'
	| 'DashboardPanel::ConfirmCancelWidgetCreateTitle'
	| 'DashboardPanel::ConfirmCancelWidgetCreateYes'
	| 'DashboardPanel::Dashboards'
	| 'DashboardPanel::NewWidget';

// containers/DateGroupModal
type DateGroupModal =
	| 'DateGroupModal::Day'
	| 'DateGroupModal::Week'
	| 'DateGroupModal::SevenDays'
	| 'DateGroupModal::Month'
	| 'DateGroupModal::Quarter'
	| 'DateGroupModal::Year'
	| 'DateGroupModal::Minutes'
	| 'DateGroupModal::Hours'
	| 'DateGroupModal::Between'
	| 'DateGroupModal::Last'
	| 'DateGroupModal::Near'
	| 'DateGroupModal::LastHours'
	| 'DateGroupModal::NearHours'
	| 'DateGroupModal::Today'
	| 'DateGroupModal::Empty'
	| 'DateGroupModal::NotEmpty'
	| 'DateGroupModal::DateTimeDay::ddMM'
	| 'DateGroupModal::DateTimeDay::ddmmYYhhii'
	| 'DateGroupModal::DateTimeDay::ddmmYYhh'
	| 'DateGroupModal::DateTimeDay::ddmmYY'
	| 'DateGroupModal::DateTimeDay::WD'
	| 'DateGroupModal::DateTimeDay::dd'
	| 'DateGroupModal::DateTimeDay::hh'
	| 'DateGroupModal::DateTimeDay::hhii'
	| 'DateGroupModal::DateTimeDay::ii'
	| 'DateGroupModal::DateTimeDay::MM'
	| 'DateGroupModal::DateTimeDay::MMYY'
	| 'DateGroupModal::DateTimeDay::QQ'
	| 'DateGroupModal::DateTimeDay::QQYY'
	| 'DateGroupModal::DateTimeDay::7D'
	| 'DateGroupModal::DateTimeDay::WW'
	| 'DateGroupModal::DateTimeDay::WWYY'
	| 'DateGroupModal::DateTimeDay::YYYY';

// containers/DiagramWidgetForm
type DiagramWidgetForm =
	| 'DiagramWidgetForm::Parameters'
	| 'DiagramWidgetForm::Style'
	| 'DiagramWidgetForm::Options'
	| 'DiagramWidgetForm::NewWidget';

type DiagramWidgetFormScheme =
	| 'DiagramWidgetForm::Scheme::EmptyBreakdown'
	| 'DiagramWidgetForm::Scheme::EmptyDiagramName'
	| 'DiagramWidgetForm::Scheme::EmptyIndicator'
	| 'DiagramWidgetForm::Scheme::EmptyName'
	| 'DiagramWidgetForm::Scheme::EmptyParameter'
	| 'DiagramWidgetForm::Scheme::EmptySource'
	| 'DiagramWidgetForm::Scheme::Error'
	| 'DiagramWidgetForm::Scheme::CheckSourcesNumber'
	| 'DiagramWidgetForm::Scheme::SingleSourceForCompute'
	| 'DiagramWidgetForm::Scheme::MinSourceNumbers'
	| 'DiagramWidgetForm::Scheme::CheckAttributeGroup'
	| 'DiagramWidgetForm::Scheme::CheckSourceValue'
	| 'DiagramWidgetForm::Scheme::CheckSourceWidgetFilterAttributes'
	| 'DiagramWidgetForm::Scheme::CheckSourceWidgetFilterLabel'
	| 'DiagramWidgetForm::Scheme::TopSettings::TypeError'
	| 'DiagramWidgetForm::Scheme::TopSettings::Required'
	| 'DiagramWidgetForm::Scheme::UniqWidget';

// containers/FiltersOnWidget
type FiltersOnWidgetScheme =
	| 'FiltersOnWidget::Scheme::Attribute'
	| 'FiltersOnWidget::Scheme::Source'
	| 'FiltersOnWidget::Scheme::Name';

// containers/GroupModal
type GroupModalActive =
	| 'GroupModal::Active' /* Активен */
	| 'GroupModal::ContainsAny' /* Содержит любое из значений */
	| 'GroupModal::ContainsAttrCurrentObject' /* Содержит атрибут текущего объекта */
	| 'GroupModal::ContainsCurrentObject' /* Содержит текущий объект */
	| 'GroupModal::ContainsIncludingArchival' /* Содержит (включая архивные) */
	| 'GroupModal::ContainsIncludingNested' /* Содержит (включая вложенные) */
	| 'GroupModal::Contains' /* Содержит */
	| 'GroupModal::Empty' /* пусто */
	| 'GroupModal::EqualAttrCurrentObject' /* Равно атрибуту текущего объекта */
	| 'GroupModal::EqualCurrentObject' /* Равно текущему объекту */
	| 'GroupModal::Equal' /* равно */
	| 'GroupModal::Exceed' /* Просрочен */
	| 'GroupModal::ExpirationContains' /* Просроченность содержит */
	| 'GroupModal::ExpiresBetween' /* Время окончания с .. по */
	| 'GroupModal::Greater' /* больше */
	| 'GroupModal::Less' /* менее */
	| 'GroupModal::NotContainsIncludingArchival' /* Не содержит (включая архивные) */
	| 'GroupModal::NotContainsIncludingEmpty' /* Не содержит (включая пустые) */
	| 'GroupModal::NotContains' /* Не содержит */
	| 'GroupModal::NotEmpty' /* не пусто */
	| 'GroupModal::NotEqualNotEmpty' /* не равно (включая пустые) */
	| 'GroupModal::NotEqual' /* не равно (и не пусто) */
	| 'GroupModal::NotExceed' /* Не просрочен */
	| 'GroupModal::NotStarted' /* Ожидает начала */
	| 'GroupModal::Paused' /* Приостановлен */
	| 'GroupModal::StatusContains' /* Статус содержит */
	| 'GroupModal::StatusNotContains' /* Статус не содержит */
	| 'GroupModal::Stopped' /* Остановлен */
	| 'GroupModal::TimeOver' /* Кончился запас времени */
	| 'GroupModal::TitleContains' /* Название содержит */
	| 'GroupModal::TitleNotContains'; /* Название не содержит */

// containers/IntervalGroupModal
type IntervalGroupModal =
	| 'IntervalGroupModal::Second'
	| 'IntervalGroupModal::Minute'
	| 'IntervalGroupModal::Hour'
	| 'IntervalGroupModal::Day'
	| 'IntervalGroupModal::Week';

// containers/TimerValueGroupModal
type TimerValueGroupModal =
	| 'TimerValueGroupModal::Equal'
	| 'TimerValueGroupModal::NotEqual'
	| 'TimerValueGroupModal::Greater'
	| 'TimerValueGroupModal::Less'
	| 'TimerValueGroupModal::Empty'
	| 'TimerValueGroupModal::NotEmpty'
	| 'TimerValueGroupModal::Minute'
	| 'TimerValueGroupModal::Hour';

// containers/WidgetKebab
type WidgetKebabContainers =
	| 'WidgetKebab::Mode'
	| 'WidgetKebab::Export'
	| 'WidgetKebab::Data'
	| 'WidgetKebab::ClearFilter'
	| 'WidgetKebab::FiltersOnWidget';

// store/commonDialogs
type StoreCommonDialogs =
	| 'store::commonDialogs::CancelText'
	| 'store::commonDialogs::SubmitText'
	| 'store::commonDialogs::AlertSubmitText';

// store/customGroups
type StoreCustomGroups =
	| 'store::customGroups::FailCreate'
	| 'store::customGroups::FailDelete'
	| 'store::customGroups::FailSave';

// store/dashboard/settings
type StoreDashboardSettings =
	| 'store::dashboard::settings::ErrorSavingPersonalDashboard'
	| 'store::dashboard::settings::DeleteError'
	| 'store::dashboard::settings::FileSentSuccessfully'
	| 'store::dashboard::settings::FileSendingError'
	| 'store::dashboard::settings::SettingsSuccessfullyChanged'
	| 'store::dashboard::settings::ErrorSavingSettings'
	| 'store::dashboard::settings::FetchDashboardErrorText';

// store/sources/sourcesFilters
type StoreSourcesSourcesFilters =
	| 'store::sources::sourcesFilters::FilterSavingError'
	| 'store::sources::sourcesFilters::FilterRemovalError'
	| 'store::sources::sourcesFilters::FilterApplicationError';

// store/widgets
type StoreWidgets =
	| 'store::widgets::Web'
	| 'store::widgets::Any'
	| 'store::widgets::Mobile';

// store/widgets/buildData
type StoreBuildData =
	| 'store::buildData::DefaultRecordBuildDataError'
	| 'store::buildData::DefaultRecordBuildDiagramError';

// store/widgets/data
type StoreWidgetsData =
	| 'store::widgets::data::Limit'
	| 'store::widgets::data::ServerError'
	| 'store::widgets::data::RemoveWidgetConfirmNo'
	| 'store::widgets::data::RemoveWidgetConfirmYes'
	| 'store::widgets::data::RemoveWidgetConfirmTitle'
	| 'store::widgets::data::RemoveWidgetConfirmText';

// store/widgets/links
type StoreWidgetsLinks =
	| 'store::widgets::links::DataLimit';

// utils/chart
type Axios =
	| 'axios::Locales';

// utils/chart/methods
type DrillDownBySelection =
	| 'drillDownBySelection::Fail';

// utils/chart/mixins/formater
type Formatter =
	| 'Formatter::Billion'
	| 'Formatter::formatMSInterval'
	| 'Formatter::Million'
	| 'Formatter::Thousand'
	| 'Formatter::Trillion';

// utils/export
type Export =
	| 'export::Dashboard';

type RechartsFormatMSInterval =
	| 'recharts::formatMSInterval::Seconds'
	| 'recharts::formatMSInterval::Minutes'
	| 'recharts::formatMSInterval::Hours'
	| 'recharts::formatMSInterval::Days'
	| 'recharts::formatMSInterval::Weeks'
	| 'recharts::formatMSInterval::SecondsFraction'
	| 'recharts::formatMSInterval::MinutesFraction'
	| 'recharts::formatMSInterval::HoursFraction';

type SummaryTooltip =
	| 'SummaryTooltip::ChoosingDetails';

type ComparePeriodBox =
	| 'ComparePeriodBox::AtCustomRange'
	| 'ComparePeriodBox::AtPreviousDay'
	| 'ComparePeriodBox::AtPreviousMonth'
	| 'ComparePeriodBox::AtPreviousWeek'
	| 'ComparePeriodBox::AtPreviousYear'
	| 'ComparePeriodBox::CompareWithPeriod'
	| 'ComparePeriodBox::CustomRange'
	| 'ComparePeriodBox::EndPeriod'
	| 'ComparePeriodBox::PreviousDay'
	| 'ComparePeriodBox::PreviousMonth'
	| 'ComparePeriodBox::PreviousWeek'
	| 'ComparePeriodBox::PreviousYear'
	| 'ComparePeriodBox::StartPeriod';

type ComparePeriodStyle =
	| 'ComparePeriodStyle::CompareWithPeriod'
	| 'ComparePeriodStyle::NumberSymbolsAfterComma';

export type LangType =
	| AndCondition
	| AttributeAggregationField
	| AttributeCreatingModal
	| AttributeGroupField
	| AttributeSelect
	| AutoUpdateButton
	| Axios
	| AxisChartStyleTab
	| AxisSettingsBox
	| BorderFieldSet
	| BorderRangeField
	| BordersRangesFieldset
	| BordersRangesStyleBox
	| BordersRangesTypeFieldset
	| BorderStyleBox
	| BreakdownFieldset
	| BreakdownFormat
	| Chart
	| ChartDataSetSettings
	| ColorPicker
	| ColorsBox
	| ComboChartParamsTab
	| ComboChartStyleTab
	| ComparePeriodBox
	| ComparePeriodStyle
	| ComputedAttributeEditor
	| CustomColorsSettings
	| CustomGroup
	| CustomGroupSelect
	| CustomLabelColorsSettings
	| DashboardHeader
	| DashboardPanel
	| DashboardPanelContainers
	| DataLabelsBox
	| DataTopField
	| DateGroupModal
	| Datepicker
	| DiagramWidgetForm
	| DiagramWidgetFormScheme
	| DisplayModeSelectBox
	| DrillDownBySelection
	| DTIntervalFormat
	| Export
	| ExportByEmailButton
	| ExportByEmailFormFormFooter
	| ExportByEmailFormFormHeader
	| ExportByEmailFormUserField
	| FiltersOnWidget
	| FiltersOnWidgetFilterItem
	| FiltersOnWidgetScheme
	| FontStyleControl
	| Formatter
	| GroupModalActive
	| GroupModalScheme
	| HeaderBox
	| IndicatorFieldset
	| IndicatorsBox
	| IndicatorSettingsBox
	| InfoPanel
	| IntervalGroupModal
	| Kebab
	| LabelParameterFormat
	| LegendBox
	| LoadingContent
	| MainSelectList
	| MiniSelect
	| Modal
	| MultiDropDownList
	| MultiValueContainer
	| NavigationBox
	| NumberParameterFormat
	| OrConditionControl
	| ParametersDataBox
	| RechartsFormatMSInterval
	| SavedFilters
	| SearchInput
	| Select
	| SelectList
	| SelectModal
	| SelectWithCustomEdit
	| ShowTotalAmountBox
	| SortingBox
	| SourceBox
	| SourceControl
	| SourceControlTree
	| SourceFieldset
	| SourcesAndFieldsExtended
	| SpeedometerWidgetForm
	| Startup
	| StoreBuildData
	| StoreCommonDialogs
	| StoreCustomGroups
	| StoreDashboardSettings
	| StoreSourcesSourcesFilters
	| StoreWidgets
	| StoreWidgetsData
	| StoreWidgetsLinks
	| SubGroup
	| SummaryTooltip
	| SubGroupSection
	| SummaryWidgetFormIndicatorBox
	| SystemDateGroupFormat
	| SystemGroup
	| Table
	| TablePaginator
	| TableTotal
	| TableWidget
	| TableWidgetFormBodySettingsBox
	| TableWidgetFormHeaderSettingsBox
	| TableWidgetFormIndicatorsBox
	| TableWidgetFormParametersBox
	| TableWidgetFormParamsTab
	| TableWidgetFormScheme
	| TableWidgetFormSingleRowDataSetSettings
	| TableWidgetFormTableBox
	| TableWidgetFormTableTooltipForm
	| PivotWidget
	| PivotWidgetForm
	| PivotWidgetFormGroupingBox
	| PivotWidgetFormIndicatorsGroupBox
	| PivotWidgetFormSourceLinkEditor
	| TextAlignControl
	| TextArea
	| TextHandlerControl
	| TextWidgetForm
	| TextWidgetFormStyleBox
	| TimerValueGroupModal
	| TimerValueListOptionValue
	| Tree
	| TreeSelect
	| TreeSelectNode
	| ValueWithLimitWarning
	| Widget
	| WidgetAddPanel
	| WidgetCopyPanel
	| WidgetForm
	| WidgetFormChoiceWidgetTooltipForm
	| WidgetFormPanel
	| WidgetFormSimpleWidgetTooltipForm
	| WidgetKebab
	| WidgetKebabContainers
	| WidgetNameBox
	| WidgetSelectBox
	| WidgetsGrid
	| WidgetTooltip;
