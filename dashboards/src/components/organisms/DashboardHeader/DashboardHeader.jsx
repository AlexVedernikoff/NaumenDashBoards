// @flow
import AutoUpdateForm from 'containers/AutoUpdateForm';
import {Button, ButtonGroup, DropDown, Tooltip} from 'components/atoms';
import {CloseIcon} from 'icons/form';
import cn from 'classnames';
import {createName, createSnapshot, EXPORT_VARIANTS, FILE_LIST} from 'utils/export';
import type {ExportButtonProps, State} from './types';
import {ExportIcon, MailIcon, RefreshIcon, TimeIcon} from 'icons/header';
import {gridRef} from 'components/organisms/DashboardContent';
import {Modal} from 'components/molecules';
import {PLACEMENTS} from 'components/atoms/Tooltip/constants';
import type {Props} from 'containers/DashboardHeader/types';
import React, {Component, Fragment} from 'react';
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
		const name = await createName();

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
		const {autoUpdateEnabled} = this.props;
		const CN = autoUpdateEnabled ? cn(styles.buttonIcon, styles.enabledAutoUpdate) : styles.buttonIcon;

		return (
			<div className={styles.autoUpdateContainer}>
				<div className={CN}>
					<TimeIcon />
				</div>
				<AutoUpdateForm className={styles.autoUpdateForm} />
			</div>
		);
	};

	renderDownloadExportButton = () => this.renderExportButton({
		icon: <ExportIcon />,
		tip: 'Скачать',
		way: EXPORT_VARIANTS.DOWNLOAD
	});

	renderExportButton = (props: ExportButtonProps) => {
		const {icon, tip, way} = props;

		return (
			<Tooltip placement={PLACEMENTS.LEFT} text={tip}>
				<DropDown icon={icon} list={FILE_LIST} onClick={this.createDocument(way)}>
					<div className={styles.buttonIcon}>
						{icon}
					</div>
				</DropDown>
			</Tooltip>
		);
	};

	renderMailExportButton = () => this.renderExportButton({
		icon: <MailIcon />,
		tip: 'Отправить на почту',
		way: EXPORT_VARIANTS.MAIL
	});

	renderModal = () => {
		const {showModal} = this.state;

		if (showModal) {
			return (
				<Modal
					header="Удалить персональный дашборд?"
					onClose={this.hideModal}
					onSubmit={this.removePersonalDashboard}
					size="small"
					submitText="Удалить"
				/>
			);
		}
	};

	renderModeButton = () => {
		const {editDashboard, editMode, personalDashboard, seeDashboard, user} = this.props;

		if (user.role !== USER_ROLES.REGULAR || personalDashboard) {
			if (editMode) {
				return (
					<div className={styles.buttonMode}>
						<Button onClick={seeDashboard} type="button">Просмотреть</Button>
					</div>
				);
			}

			return (
				<div className={styles.buttonMode}>
					<Button onClick={editDashboard} type="button">Редактировать</Button>
				</div>
			);
		}
	};

	renderRefreshButton = () => (
		<Tooltip placement={PLACEMENTS.LEFT} text="Обновить виджеты">
			<div className={styles.buttonIcon}>
				<RefreshIcon onClick={this.handleClickRefreshButton} />
			</div>
		</Tooltip>
	);

	renderRemoveButton = () => {
		const {personalDashboard, personalDashboardDeleting} = this.props;

		if (personalDashboard) {
			return (
				<Fragment>
					<Button disabled={personalDashboardDeleting} onClick={this.showModal} outline>
						<CloseIcon />
						<span>Удалить</span>
					</Button>
					{this.renderModal()}
				</Fragment>
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
			return (
				<div className={styles.buttonMode}>
					<Button disabled={personalDashboardCreating} onClick={createPersonalDashboard} type="button">Сохранить себе</Button>
				</div>
			);
		}
	};

	renderSwitchDashboardButton = () => {
		const {personalDashboard, switching, user} = this.props;
		const {hasPersonalDashboard} = user;

		if (hasPersonalDashboard) {
			return (
				<ButtonGroup disabled={switching}>
					<Button onClick={this.handleClickSwitchButton(true)} outline={!personalDashboard} variant={BUTTON_VARIANTS.GREEN}>Личный</Button>
					<Button onClick={this.handleClickSwitchButton(false)} outline={personalDashboard} variant={BUTTON_VARIANTS.GREEN}>Общий</Button>
				</ButtonGroup>
			);
		}
	};

	render () {
		return (
			<header className={styles.header}>
				<ul className={styles.nav}>
					<li className={styles.navItem}>
						{this.renderSwitchDashboardButton()}
					</li>
				</ul>
				<ul className={styles.nav}>
					<li className={styles.navItem}>
						{this.renderAutoUpdateButton()}
					</li>
					<li className={styles.navItem}>
						{this.renderRefreshButton()}
					</li>
					<li className={styles.navItem}>
						{this.renderDownloadExportButton()}
					</li>
					<li className={styles.navItem}>
						{this.renderMailExportButton()}
					</li>
					<li className={styles.navItem}>
						{this.renderRemoveButton()}
					</li>
					<li className={styles.navItem}>
						{this.renderSaveSelfButton()}
					</li>
					<li className={styles.navItem}>
						{this.renderModeButton()}
					</li>
				</ul>
			</header>
		);
	}
}

export default DashboardHeader;
