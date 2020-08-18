// @flow
import {AutoUpdateForm, DropDownButton, IconButton, NavItem} from './components';
import {Button, ButtonGroup} from 'components/atoms';
import {createContextName} from 'utils/export/helpers';
import {createSnapshot, EXPORT_VARIANTS} from 'utils/export';
import {EXPORT_LIST} from './constants';
import {FOOTER_POSITIONS, SIZES as MODAL_SIZES} from 'components/molecules/Modal/constants';
import {gridRef} from 'components/organisms/DashboardContent';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import isMobile from 'ismobilejs';
import {LAYOUT_MODE} from 'store/dashboard/settings/constants';
import {Modal} from 'components/molecules';
import type {Props} from 'containers/DashboardHeader/types';
import React, {Component} from 'react';
import type {State} from './types';
import styles from './styles.less';
import {USER_ROLES} from 'store/context/constants';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';
import {VARIANTS as ICON_BUTTON_VARIANTS} from './components/IconButton/constants';

export class DashboardHeader extends Component<Props, State> {
	state = {
		showModal: false
	};

	componentDidMount () {
		const {changeLayoutMode, personalDashboard, user} = this.props;

		if (user.role === USER_ROLES.REGULAR && !personalDashboard) {
			changeLayoutMode(LAYOUT_MODE.WEB);
		}
	}

	createDocument = (way: string) => async (type: string) => {
		const {DOWNLOAD, MAIL} = EXPORT_VARIANTS;
		const {sendToMail} = this.props;
		const {current} = gridRef;
		const toDownload = way === DOWNLOAD;
		const name = await createContextName();

		if (current) {
			const file = await createSnapshot({
				container: current,
				fragment: false,
				name,
				toDownload,
				type
			});

			if (way === MAIL && file) {
				sendToMail(name, type, file);
			}
		}
	};

	handleChangeDisplayMode = () => {
		const {changeLayoutMode, layoutMode} = this.props;
		const mode = layoutMode === LAYOUT_MODE.WEB ? LAYOUT_MODE.MOBILE : LAYOUT_MODE.WEB;

		changeLayoutMode(mode);
	};

	handleClickRefreshButton = () => {
		const {getSettings, personalDashboard} = this.props;
		getSettings(personalDashboard);
	};

	handleClickSwitchButton = (personal: boolean) => () => {
		const {personalDashboard, switchDashboard} = this.props;

		if (personalDashboard !== personal) {
			switchDashboard();
		}
	};

	hideModal = () => this.setState({showModal: false});

	removePersonalDashboard = () => {
		const {removePersonalDashboard} = this.props;

		this.hideModal();
		removePersonalDashboard();
	};

	showModal = () => this.setState({showModal: true});

	renderAutoUpdateButton = () => {
		const {autoUpdateSettings, saveAutoUpdateSettings} = this.props;

		return (
			<NavItem className={styles.autoUpdateItem}>
				<AutoUpdateForm
					autoUpdateSettings={autoUpdateSettings}
					className={styles.autoUpdateForm}
					onSubmit={saveAutoUpdateSettings}
				/>
			</NavItem>
		);
	};

	renderDisplayModeButton = () => {
		const {layoutMode, personalDashboard, user} = this.props;
		const isDesktop = !isMobile().any;
		const isMobileLayoutMode = layoutMode === LAYOUT_MODE.MOBILE;
		const customTip = isMobileLayoutMode ? 'Переключиться в WEB представление' : 'Переключиться в мобильное представление';

		if (isDesktop && user.role !== USER_ROLES.REGULAR && !personalDashboard) {
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
				onSelect={this.createDocument(EXPORT_VARIANTS.DOWNLOAD)}
				tip="Скачать"
			/>
		</NavItem>
	);

	renderMailExportButton = () => (
		<NavItem>
			<DropDownButton
				menu={EXPORT_LIST}
				name={ICON_NAMES.MAIL}
				onSelect={this.createDocument(EXPORT_VARIANTS.MAIL)}
				tip="Отправить на почту"
			/>
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
		const {editDashboard, editMode, personalDashboard, seeDashboard, user} = this.props;
		const disabledEditButton = user.role === USER_ROLES.REGULAR && !personalDashboard;

		return editMode
			? this.renderNavButton('Просмотреть', seeDashboard)
			: this.renderNavButton('Редактировать', editDashboard, disabledEditButton);
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
			personalDashboard,
			personalDashboardCreating,
			user
		} = this.props;
		const {hasPersonalDashboard, role} = user;
		const {SUPER} = USER_ROLES;

		if (role !== SUPER && !hasPersonalDashboard && !personalDashboard && editableDashboard) {
			return this.renderNavButton('Сохранить себе', createPersonalDashboard, personalDashboardCreating);
		}
	};

	renderSwitchDashboardButton = () => {
		const {personalDashboard, switching, user} = this.props;
		const {hasPersonalDashboard} = user;

		if (hasPersonalDashboard) {
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
		return (
			<header className={styles.header}>
				<ul className={styles.nav}>
					{this.renderSwitchDashboardButton()}
				</ul>
				{this.renderDisplayModeButton()}
				<ul className={styles.nav}>
					{this.renderAutoUpdateButton()}
					{this.renderRefreshButton()}
					{this.renderDownloadExportButton()}
					{this.renderMailExportButton()}
					{this.renderRemoveButton()}
					{this.renderSaveSelfButton()}
					{this.renderModeButton()}
				</ul>
			</header>
		);
	}
}

export default DashboardHeader;
