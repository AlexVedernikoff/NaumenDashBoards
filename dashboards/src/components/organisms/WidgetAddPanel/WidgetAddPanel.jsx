// @flow
import {Button, IconButton, Text} from 'components/atoms';
import cn from 'classnames';
import {ICON_NAMES} from 'components/atoms/Icon';
import {Modal, MultiDropDownList} from 'components/molecules';
import NewWidget from 'store/widgets/data/NewWidget';
import type {Props} from 'containers/WidgetAddPanel/types';
import React, {Component} from 'react';
import {SIZES} from 'components/molecules/Modal/constants';
import type {State} from './types';
import styles from './styles.less';
import {TEXT_TYPES} from 'components/atoms/Text/constants';
import type {TitleProps} from 'components/templates/WidgetForm/types';
import {USER_ROLES} from 'store/context/constants';
import {VARIANTS} from 'components/atoms/IconButton/constants';
import {WidgetForm} from 'components/templates';

export class WidgetAddPanel extends Component<Props, State> {
	state = {
		invalidWidgetId: ''
	};

	handleCloseModal = () => this.setState({invalidWidgetId: ''});

	handleSelect = async (item: Object) => {
		const {copyWidget, validateWidgetToCopy} = this.props;
		const {value: widgetId} = item;
		const isValid = await validateWidgetToCopy(widgetId);

		if (!isValid) {
			return this.setState({invalidWidgetId: widgetId});
		}

		copyWidget(widgetId);
	};

	handleSubmit = () => {
		const {addWidget, layoutMode} = this.props;
		addWidget(new NewWidget(layoutMode));
	};

	handleSubmitModal = () => {
		const {copyWidget} = this.props;
		const {invalidWidgetId} = this.state;

		this.setState({invalidWidgetId: ''});
		copyWidget(invalidWidgetId);
	};

	renderCancelButton = () => null;

	renderDashboardsList = () => {
		const {dashboards, fetchDashboards, user} = this.props;
		const {items, loading, uploaded} = dashboards;

		if (user.role !== USER_ROLES.REGULAR) {
			return (
				<MultiDropDownList
					fetch={fetchDashboards}
					items={items}
					loading={loading}
					onSelect={this.handleSelect}
					uploaded={uploaded}
				/>
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

	renderTitle = (onClick: Function) => (props: TitleProps) => {
		const {children, className} = props;

		return (
			<div className={cn(className, styles.formTitle)}>
				{children}
				<IconButton active={true} icon={ICON_NAMES.PLUS} onClick={onClick} round={false} variant={VARIANTS.INFO} />
			</div>
		);
	};

	render () {
		const components = {
			CancelButton: this.renderCancelButton,
			SubmitButton: this.renderSubmitButton,
			Title: this.renderTitle(this.handleSubmit)
		};

		return (
			<WidgetForm components={components} onSubmit={this.handleSubmit} title="Добавление виджета">
				<div className={styles.content}>
					<Text className={styles.field} type={TEXT_TYPES.SMALL}>
						Выберите виджет из существующих вариантов или создайте новый.
					</Text>
					{this.renderDashboardsList()}
					{this.renderModal()}
				</div>
			</WidgetForm>
		);
	}
}

export default WidgetAddPanel;
