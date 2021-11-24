// @flow

import AutoUpdateButton from 'containers/AutoUpdateButton';
import Button, {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button';
import ButtonGroup from 'components/atoms/ButtonGroup';
import {DASHBOARD_HEADER_HEIGHT, EXPORT_LIST} from './constants';
import DropDownButton from './components/DropDownButton';
import ExportByEmailButton from './components/ExportByEmailButton';
import exporter from 'utils/export';
import {FILE_VARIANTS} from 'utils/export/constants';
import {FOOTER_POSITIONS, SIZES as MODAL_SIZES} from 'components/molecules/Modal/constants';
import {gridRef} from 'components/organisms/WidgetsGrid/constants';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import IconButton from './components/IconButton';
import isMobile from 'ismobilejs';
import {LAYOUT_MODE} from 'store/dashboard/settings/constants';
import Modal from 'components/molecules/Modal';
import NavItem from './components/NavItem';
import type {Props} from 'containers/DashboardHeader/types';
import React, {Component} from 'react';
import type {State} from './types';
import styles from './styles.less';
import {USER_ROLES} from 'store/context/constants';
import {VARIANTS as ICON_BUTTON_VARIANTS} from './components/IconButton/constants';

export class DashboardHeader extends Component<Props, State> {
	state = {
		showModal: false
	};

	handleChangeDisplayMode = () => {
		const {changeLayoutMode, layoutMode} = this.props;
		const mode = layoutMode === LAYOUT_MODE.WEB ? LAYOUT_MODE.MOBILE : LAYOUT_MODE.WEB;

		changeLayoutMode(mode);
	};

	handleClickRefreshButton = () => {
		const {getSettings} = this.props;

		getSettings(true);
	};

	handleClickSwitchButton = (personal: boolean) => () => {
		const {personalDashboard, switchDashboard} = this.props;

		if (personalDashboard !== personal) {
			switchDashboard();
		}
	};

	handleExportDownload = async (type: string) => {
		const {current} = gridRef;

		if (current) {
			const {PDF, PNG} = FILE_VARIANTS;

			if (type === PNG) {
				await exporter.exportDashboardAsPNG(current, true);
			} else if (type === PDF) {
				await exporter.exportDashboardAsPDF(true);
			}
		}
	};

	hideModal = () => this.setState({showModal: false});

	removePersonalDashboard = () => {
		const {removePersonalDashboard} = this.props;

		this.hideModal();
		removePersonalDashboard();
	};

	showModal = () => this.setState({showModal: true});

	renderAutoUpdateButton = () => (
		<NavItem className={styles.autoUpdateItem}>
			<AutoUpdateButton className={styles.autoUpdateForm} />
		</NavItem>
	);

	renderControls = () => (
		<ul className={styles.nav}>
			{this.renderAutoUpdateButton()}
			{this.renderRefreshButton()}
			{this.renderDownloadExportButton()}
			{this.renderMailExportButton()}
			{this.renderRemoveButton()}
			{this.renderSaveSelfButton()}
			{this.renderModeButton()}
		</ul>
	);

	renderDisplayModeButton = () => {
		const {isEditableContext, layoutMode, user} = this.props;
		const isMobileLayoutMode = layoutMode === LAYOUT_MODE.MOBILE;
		const customTip = isMobileLayoutMode ? 'Переключиться в WEB представление' : 'Переключиться в мобильное представление';

		if (user.role !== USER_ROLES.REGULAR && !isEditableContext) {
			return (
				<div className={styles.displayModeContainer}>
					<IconButton
						name={isMobileLayoutMode ? ICON_NAMES.MOBILE : ICON_NAMES.WEB}
						onClick={this.handleChangeDisplayMode}
						outline
						tip={customTip}
						variant={ICON_BUTTON_VARIANTS.GREEN}
					/>
				</div>
			);
		}

		return null;
	};

	renderDownloadExportButton = () => (
		<NavItem>
			<DropDownButton
				menu={EXPORT_LIST}
				name={ICON_NAMES.DOWNLOAD}
				onSelect={this.handleExportDownload}
				tip="Скачать"
			/>
		</NavItem>
	);

	renderMailExportButton = () => (
		<NavItem>
			<ExportByEmailButton />
		</NavItem>
	);

	renderModal = () => {
		const {showModal} = this.state;

		if (showModal) {
			return (
				<Modal
					cancelText="Нет"
					footerPosition={FOOTER_POSITIONS.RIGHT}
					header="Подтверждение удаления"
					notice={true}
					onClose={this.hideModal}
					onSubmit={this.removePersonalDashboard}
					size={MODAL_SIZES.SMALL}
					submitText="Да"
				>
					Вы действительно хотите удалить персональный дашборд?
				</Modal>
			);
		}
	};

	renderModeButton = () => {
		const {editDashboard, editMode, isEditableContext, seeDashboard, user} = this.props;

		if (user.role !== USER_ROLES.REGULAR || isEditableContext) {
			return editMode
				? this.renderNavButton('Просмотреть', seeDashboard)
				: this.renderNavButton('Редактировать', editDashboard);
		}

		return null;
	};

	renderNavButton = (text: string, onClick: Function, disabled: boolean = false) => (
		<NavItem>
			<Button className={styles.navButton} disabled={disabled} onClick={onClick}>{text}</Button>
		</NavItem>
	);

	renderRefreshButton = () => (
		<NavItem>
			<IconButton name={ICON_NAMES.REFRESH} onClick={this.handleClickRefreshButton} tip="Обновить виджеты" />
		</NavItem>
	);

	renderRemoveButton = () => {
		const {personalDashboard, personalDashboardDeleting} = this.props;

		if (personalDashboard) {
			return (
				<NavItem>
					<Button disabled={personalDashboardDeleting} onClick={this.showModal} outline>
						<Icon className={styles.removeIcon} name={ICON_NAMES.CLOSE} />
						<span>Удалить</span>
					</Button>
					{this.renderModal()}
				</NavItem>
			);
		}
	};

	renderSaveSelfButton = () => {
		const {
			createPersonalDashboard,
			editableDashboard,
			isUserMode,
			personalDashboard,
			personalDashboardCreating,
			user
		} = this.props;
		const {hasPersonalDashboard, role} = user;
		const {SUPER} = USER_ROLES;

		if (role !== SUPER && !isUserMode && !hasPersonalDashboard && !personalDashboard && editableDashboard) {
			return this.renderNavButton('Сохранить себе', createPersonalDashboard, personalDashboardCreating);
		}
	};

	renderSwitchDashboardButton = () => {
		const {isUserMode, personalDashboard, switching, user} = this.props;
		const {hasPersonalDashboard} = user;

		if (!isUserMode && hasPersonalDashboard) {
			return (
				<NavItem>
					<ButtonGroup disabled={switching}>
						<Button onClick={this.handleClickSwitchButton(true)} outline={!personalDashboard} variant={BUTTON_VARIANTS.GREEN}>Личный</Button>
						<Button onClick={this.handleClickSwitchButton(false)} outline={personalDashboard} variant={BUTTON_VARIANTS.GREEN}>Общий</Button>
					</ButtonGroup>
				</NavItem>
			);
		}
	};

	render () {
		if (!isMobile().any) {
			return (
				<header className={styles.header} style={{height: DASHBOARD_HEADER_HEIGHT}}>
					<ul className={styles.nav}>
						{this.renderSwitchDashboardButton()}
					</ul>
					{this.renderDisplayModeButton()}
					{this.renderControls()}
				</header>
			);
		}

		return null;
	}
}

export default DashboardHeader;
