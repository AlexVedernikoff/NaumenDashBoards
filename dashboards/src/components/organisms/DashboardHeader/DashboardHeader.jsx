// @flow
import AutoUpdateForm from 'containers/AutoUpdateForm';
import {Button, DropDown, Tooltip} from 'components/atoms';
import cn from 'classnames';
import {CloseIcon} from 'icons/form';
import {createName, createSnapshot, EXPORT_VARIANTS, FILE_LIST} from 'utils/export';
import type {ExportButtonProps, State} from './types';
import {ExportIcon, MailIcon, RefreshIcon, TimeIcon} from 'icons/header';
import {gridRef} from 'components/organisms/DashboardContent';
import {Modal} from 'components/molecules';
import type {Props} from 'containers/DashboardHeader/types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';

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

	hideModal = () => this.setState({showModal: false});

	resetDashboard = () => {
		const {resetDashboard} = this.props;

		this.hideModal();
		resetDashboard();
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
			<Tooltip tooltip={tip} placement="left">
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
					header="Cбросить настройки?"
					onClose={this.hideModal}
					onSubmit={this.resetDashboard}
					size="small"
					submitText="Сбросить"
				/>
			);
		}
	};

	renderModeButton = () => {
		const {editable, editDashboard, editMode, seeDashboard} = this.props;

		if (editable) {
			if (editMode) {
				return (
					<div className={styles.buttonMode}>
						<Button type="button" onClick={seeDashboard}>Просмотреть</Button>
					</div>
				);
			}

			return (
				<div className={styles.buttonMode}>
					<Button type="button" onClick={editDashboard}>Редактировать</Button>
				</div>
			);
		}
	};

	renderRefreshButton = () => {
		const {getSettings} = this.props;

		return (
			<Tooltip tooltip="Обновить виджеты" placement="left">
				<div className={styles.buttonIcon}>
					<RefreshIcon onClick={getSettings} />
				</div>
			</Tooltip>
		);
	};

	renderResetButton = () => {
		const {editable, role} = this.props;

		if (role !== 'super' && editable) {
			return (
				<Fragment>
					<div className={styles.buttonIcon} onClick={this.showModal}>
						<CloseIcon className={styles.closeIcon} />
						Сбросить настройки
					</div>
					{this.renderModal()}
				</Fragment>
			);
		}
	};

	render () {
		return (
			<header className={styles.header}>
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
						{this.renderResetButton()}
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
