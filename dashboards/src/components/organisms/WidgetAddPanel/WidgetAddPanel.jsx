// @flow
import {Button, IconButton, Text} from 'components/atoms';
import cn from 'classnames';
import {createNewWidget} from 'store/widgets/data/helpers';
import {ICON_NAMES} from 'components/atoms/Icon';
import {Modal, MultiDropDownList} from 'components/molecules';
import NewWidget from 'store/widgets/data/NewWidget';
import type {Props} from 'containers/WidgetAddPanel/types';
import React, {Component, Fragment} from 'react';
import {SIZES} from 'components/molecules/Modal/constants';
import type {State} from './types';
import styles from './styles.less';
import {TEXT_TYPES} from 'components/atoms/Text/constants';
import type {TitleProps} from 'components/templates/WidgetForm/types';
import {USER_ROLES} from 'store/context/constants';
import {VARIANTS} from 'components/atoms/IconButton/constants';
import {WidgetForm} from 'components/templates';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export class WidgetAddPanel extends Component<Props, State> {
	state = {
		invalidWidgetId: ''
	};

	addDiagramWidget = () => {
		const {layoutMode} = this.props;
		this.addWidget(createNewWidget(layoutMode));
	};

	addTextWidget = () => {
		const {layoutMode} = this.props;
		this.addWidget(createNewWidget(layoutMode, WIDGET_TYPES.TEXT));
	};

	addWidget = (widget?: NewWidget) => widget && this.props.addWidget(widget);

	handleCloseModal = () => this.setState({invalidWidgetId: ''});

	handleFocusSearchInput = () => {
		const {dashboards, fetchDashboards} = this.props;
		!dashboards.uploaded && fetchDashboards();
	};

	handleSelect = async (item: Object) => {
		const {copyWidget, validateWidgetToCopy} = this.props;
		const {value: widgetId} = item;
		const isValid = await validateWidgetToCopy(widgetId);

		if (!isValid) {
			return this.setState({invalidWidgetId: widgetId});
		}

		copyWidget(widgetId);
	};

	handleSubmitModal = () => {
		const {copyWidget} = this.props;
		const {invalidWidgetId} = this.state;

		this.setState({invalidWidgetId: ''});
		copyWidget(invalidWidgetId);
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
		const {invalidWidgetId} = this.state;

		if (invalidWidgetId) {
			return (
				<Modal
					header="Подтверждение копирования"
					notice={true}
					onClose={this.handleCloseModal}
					onSubmit={this.handleSubmitModal}
					size={SIZES.SMALL}
				>
					Виджет будет скопирован без относительных критериев фильтрации. Продолжить копирование?
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
