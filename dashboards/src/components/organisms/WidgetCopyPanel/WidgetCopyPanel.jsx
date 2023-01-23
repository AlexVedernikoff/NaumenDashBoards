// @flow
import Button from 'components/atoms/Button';
import type {CancelButtonProps} from 'components/templates/WidgetForm/types';
import {COPY_WIDGET_ERRORS} from 'store/widgets/data/constants';
import type {DivRef} from 'components/types';
import Modal from 'components/molecules/Modal';
import MultiDropDownList from 'components/molecules/MultiDropDownList';
import type {Props} from 'containers/WidgetCopyPanel/types';
import React, {Component, createRef, Fragment} from 'react';
import {SIZES} from 'components/molecules/Modal/constants';
import type {State} from './types';
import styles from './styles.less';
import T from 'components/atoms/Translation';
import t from 'localization';
import Text from 'components/atoms/Text';
import {TEXT_TYPES} from 'components/atoms/Text/constants';
import {USER_ROLES} from 'store/context/constants';
import type {Value} from 'components/molecules/MultiDropDownList/types';
import WidgetForm from 'components/templates/WidgetForm';

export class WidgetCopyPanel extends Component<Props, State> {
	relativeElement: DivRef = createRef();

	state = {
		invalidCopyData: null
	};

	handleCloseForm = () => {
		this.props.cancelForm();
	};

	handleCloseModal = () => this.setState({invalidCopyData: null});

	handleFocusSearchInput = () => {
		const {dashboards, fetchDashboards} = this.props;

		!dashboards.uploaded && fetchDashboards();
	};

	handleSelect = async (item: Value) => {
		const {copyWidget, validateWidgetToCopy} = this.props;
		const {parent, value: widgetId} = item;

		if (parent) {
			const {value: dashboardId} = parent;
			const {isValid, reasons = []} = await validateWidgetToCopy(dashboardId, widgetId);

			if (!isValid) {
				return this.setState({
					invalidCopyData: {
						dashboardId,
						reasons,
						widgetId
					}
				});
			}

			copyWidget(dashboardId, widgetId, this.relativeElement);
		}
	};

	handleSubmitModal = () => {
		const {copyWidget} = this.props;
		const {invalidCopyData} = this.state;

		if (invalidCopyData) {
			const {dashboardId, widgetId} = invalidCopyData;

			this.setState({invalidCopyData: null});
			copyWidget(dashboardId, widgetId, this.relativeElement);
		}
	};

	renderCancelButton = (props: CancelButtonProps) => (
		<Button onClick={props.onCancel}>
			<T text="WidgetCopyPanel::Cancel" />
		</Button>
	);

	renderDashboardsList = () => {
		const {dashboards, isEditableContext, isUserMode, user} = this.props;
		const {items, loading} = dashboards;

		if (user.role !== USER_ROLES.REGULAR && !isEditableContext && !isUserMode) {
			return (
				<Fragment>
					<Text className={styles.field} type={TEXT_TYPES.SMALL}>
						<T text="WidgetCopyPanel::OrChoiceVariant" />
					</Text>
					<MultiDropDownList
						items={items}
						loading={loading}
						onFocusSearchInput={this.handleFocusSearchInput}
						onSelect={this.handleSelect}
					/>
				</Fragment>
			);
		}
	};

	renderModal = () => {
		const {invalidCopyData} = this.state;

		if (invalidCopyData) {
			let message = t('WidgetCopyPanel::NoFullCopy');
			const {reasons} = invalidCopyData;
			const hasSubjectFilters = reasons.includes(COPY_WIDGET_ERRORS.HAS_SUBJECT_FILTERS);
			const hasCustomGroupsWithRelativeCriteria = reasons.includes(COPY_WIDGET_ERRORS.HAS_CUSTOM_GROUPS_WITH_RELATIVE_CRITERIA);
			const hasOnlyRelativeCriteriaCustomGroups = reasons.includes(COPY_WIDGET_ERRORS.HAS_ONLY_RELATIVE_CRITERIA_CUSTOM_GROUPS);

			if (hasSubjectFilters && hasOnlyRelativeCriteriaCustomGroups) {
				message = t('WidgetCopyPanel::NoReferenceAndUserGroupCopy');
			} else if (hasSubjectFilters || hasCustomGroupsWithRelativeCriteria) {
				message = t('WidgetCopyPanel::NoReferenceCopy');
			} else if (hasOnlyRelativeCriteriaCustomGroups) {
				message = t('WidgetCopyPanel::NoUserGroupCopy');
			}

			return (
				<Modal
					header={t('WidgetCopyPanel::Confirm')}
					notice={true}
					onClose={this.handleCloseModal}
					onSubmit={this.handleSubmitModal}
					relativeElement={this.relativeElement}
					size={SIZES.SMALL}
				>
					{message}
				</Modal>
			);
		}
	};

	render () {
		const components = {
			CancelButton: this.renderCancelButton,
			SubmitButton: () => null
		};

		return (
			<WidgetForm components={components} onCancel={this.handleCloseForm}>
				<div className={styles.content} ref={this.relativeElement}>
					{this.renderDashboardsList()}
					{this.renderModal()}
				</div>
			</WidgetForm>
		);
	}
}

export default WidgetCopyPanel;
