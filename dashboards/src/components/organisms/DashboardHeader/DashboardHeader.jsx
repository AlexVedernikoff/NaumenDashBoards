// @flow
import {AutoUpdateForm, DropDownButton, IconButton, NavItem} from './components';
import {Button, ButtonGroup} from 'components/atoms';
import {createSnapshot, EXPORT_VARIANTS} from 'utils/export';
import {EXPORT_LIST} from './constants';
import {FOOTER_POSITIONS, SIZES as MODAL_SIZES} from 'components/molecules/Modal/constants';
import {gridRef} from 'components/organisms/DashboardContent';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import {Modal} from 'components/molecules';
import type {Props} from 'containers/DashboardHeader/types';
import React, {Component} from 'react';
import type {State} from './types';
import styles from './styles.less';
import {USER_ROLES} from 'store/context/constants';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

export class DashboardHeader extends Component<Props, State> {
	state = {
		showModal: false
	};

	createDocument = (way: string) => async (type: string) => {
		const {DOWNLOAD, MAIL} = EXPORT_VARIANTS;
		const {sendToMail} = this.props;
		const {current} = gridRef;
		const toDownload = way === DOWNLOAD;
		const name = '';

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
		const buttonCN = autoUpdateSettings.enabled ? styles.enabledAutoUpdateButton : '';

		return (
			<NavItem className={styles.autoUpdateItem}>
				<IconButton className={buttonCN} name={ICON_NAMES.TIMER} />
				<AutoUpdateForm
					autoUpdateSettings={autoUpdateSettings}
					className={styles.autoUpdateForm}
					onSubmit={saveAutoUpdateSettings}
				/>
			</NavItem>
		);
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

		if (user.role !== USER_ROLES.REGULAR || personalDashboard) {
			return editMode ? this.renderNavButton('Просмотреть', seeDashboard) : this.renderNavButton('Редактировать', editDashboard);
		}
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
						<Icon name={ICON_NAMES.REMOVE} />
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
		const {MASTER, SUPER} = USER_ROLES;

		if (role !== SUPER && !hasPersonalDashboard && !personalDashboard && (role === MASTER || editableDashboard)) {
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
