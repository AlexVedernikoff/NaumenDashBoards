// @flow
import Button from 'components/atoms/Button';
import cn from 'classnames';
import {COPY_WIDGET_ERRORS, WIDGET_TYPES} from 'store/widgets/data/constants';
import {createNewWidget} from 'store/widgets/data/helpers';
import IconButton, {VARIANTS} from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import Modal from 'components/molecules/Modal';
import MultiDropDownList from 'components/molecules/MultiDropDownList';
import NewWidget from 'store/widgets/data/NewWidget';
import type {Props} from 'containers/WidgetAddPanel/types';
import React, {Component, Fragment} from 'react';
import {SIZES} from 'components/molecules/Modal/constants';
import type {State} from './types';
import styles from './styles.less';
import Text from 'components/atoms/Text';
import {TEXT_TYPES} from 'components/atoms/Text/constants';
import type {TitleProps} from 'components/templates/WidgetForm/types';
import {USER_ROLES} from 'store/context/constants';
import type {Value} from 'components/molecules/MultiDropDownList/types';
import WidgetForm from 'components/templates/WidgetForm';

export class WidgetAddPanel extends Component<Props, State> {
	state = {
		invalidCopyData: null
	};

	addDiagramWidget = () => {
		const {layoutMode} = this.props;

		this.addWidget(createNewWidget(layoutMode));
	};

	addTextWidget = () => {
		const {layoutMode} = this.props;

		this.addWidget(createNewWidget(layoutMode, WIDGET_TYPES.TEXT));
	};

	addWidget = (widget?: NewWidget) => widget && this.props.addNewWidget(widget);

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

			copyWidget(dashboardId, widgetId);
		}
	};

	handleSubmitModal = () => {
		const {copyWidget} = this.props;
		const {invalidCopyData} = this.state;

		if (invalidCopyData) {
			const {dashboardId, widgetId} = invalidCopyData;

			this.setState({invalidCopyData: null});
			copyWidget(dashboardId, widgetId);
		}
	};

	renderCancelButton = () => null;

	renderDashboardsList = () => {
		const {dashboards, personalDashboard, user} = this.props;
		const {items, loading} = dashboards;

		if (user.role !== USER_ROLES.REGULAR && !personalDashboard) {
			return (
				<Fragment>
					<Text className={styles.field} type={TEXT_TYPES.SMALL}>
						Или выберите виджет из существующих вариантов для копирования
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
			let message = 'Виджет будет скопирован не полностью. Продолжить копирование?';
			const {reasons} = invalidCopyData;
			const hasSubjectFilters = reasons.includes(COPY_WIDGET_ERRORS.HAS_SUBJECT_FILTERS);
			const hasCustomGroupsWithRelativeCriteria = reasons.includes(COPY_WIDGET_ERRORS.HAS_CUSTOM_GROUPS_WITH_RELATIVE_CRITERIA);
			const hasOnlyRelativeCriteriaCustomGroups = reasons.includes(COPY_WIDGET_ERRORS.HAS_ONLY_RELATIVE_CRITERIA_CUSTOM_GROUPS);

			if (hasSubjectFilters && hasOnlyRelativeCriteriaCustomGroups) {
				message = 'Виджет будет скопирован без относительных критериев фильтрации. Настроенные пользовательские группировки будут заменены на системные. Продолжить копирование?';
			} else if (hasSubjectFilters || hasCustomGroupsWithRelativeCriteria) {
				message = 'Виджет будет скопирован без относительных критериев фильтрации. Продолжить копирование?';
			} else if (hasOnlyRelativeCriteriaCustomGroups) {
				message = 'В виджете использована пользовательская настройка группировки и будет изменена на системную. Продолжить копирование?';
			}

			return (
				<Modal
					header="Подтверждение копирования"
					notice={true}
					onClose={this.handleCloseModal}
					onSubmit={this.handleSubmitModal}
					size={SIZES.SMALL}
				>
					{message}
				</Modal>
			);
		}
	};

	renderSubmitButton = (props: Object) => {
		const {onSubmit} = props;

		return <Button onClick={onSubmit}>Создать</Button>;
	};

	renderTitle = (props: TitleProps) => {
		const {className} = props;

		return (
			<div className={cn(className, styles.title)}>
				<div className={styles.titleRow}>
					<span>Добавить текст</span>
					<IconButton
						active={true}
						icon={ICON_NAMES.PLUS}
						onClick={this.addTextWidget}
						round={false}
						variant={VARIANTS.INFO}
					/>
				</div>
				<div className={styles.titleRow}>
					<span>Добавить виджет</span>
					<IconButton
						active={true}
						icon={ICON_NAMES.PLUS}
						onClick={this.addDiagramWidget}
						round={false}
						variant={VARIANTS.INFO}
					/>
				</div>
			</div>
		);
	};

	render () {
		const components = {
			CancelButton: this.renderCancelButton,
			SubmitButton: this.renderSubmitButton,
			Title: this.renderTitle
		};

		return (
			<WidgetForm components={components} onSubmit={this.addDiagramWidget}>
				<div className={styles.content}>
					{this.renderDashboardsList()}
					{this.renderModal()}
				</div>
			</WidgetForm>
		);
	}
}

export default WidgetAddPanel;
