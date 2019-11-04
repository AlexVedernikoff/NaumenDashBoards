// @flow
import {Button, DropDown, Tooltip} from 'components/atoms';
import {CloseIcon} from 'icons/form';
import {createSnapshot, EXPORT_VARIANTS, FILE_VARIANTS} from 'utils/export';
import type {ExportButtonProps} from './types';
import {ExportIcon, MailIcon} from 'icons/header';
import {gridRef} from 'components/organisms/LayoutGrid';
import IconRefresh from 'icons/header/refresh.svg';
import React, {Component} from 'react';
import type {Props} from 'containers/DashboardHeader/types';
import styles from './styles.less';

const FileList = [
	{
		key: FILE_VARIANTS.PDF,
		text: FILE_VARIANTS.PDF
	},
	{
		key: FILE_VARIANTS.PNG,
		text: FILE_VARIANTS.PNG
	}
];

export class DashboardHeader extends Component<Props> {
	createDocument = (way: string) => async (type: string) => {
		const {DOWNLOAD, MAIL} = EXPORT_VARIANTS;
		const {sendToMail} = this.props;
		const {current} = gridRef;
		const toDownload = way === DOWNLOAD;

		if (current) {
			const file = await createSnapshot(current, type, toDownload, 'Дашборд');

			if (way === MAIL && file) {
				sendToMail(file, type);
			}
		}
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
				<DropDown icon={icon} list={FileList} onClick={this.createDocument(way)} />
			</Tooltip>
		);
	};

	renderMailExportButton = () => this.renderExportButton({
		icon: <MailIcon />,
		tip: 'Отправить на почту',
		way: EXPORT_VARIANTS.MAIL
	});

	renderModeButton = () => {
		const {editable, editDashboard, location, master, seeDashboard} = this.props;

		if (editable || master) {
			if (location.pathname === '/') {
				return (
					<div className={styles.buttonMode}>
						<Button type="button" onClick={editDashboard}>Редактировать</Button>
					</div>
				);
			}

			return (
				<div className={styles.buttonMode}>
					<Button type="button" onClick={seeDashboard}>Просмотреть</Button>
				</div>
			);
		}
	};

	renderRefreshButton = () => {
		const {fetchDashboard} = this.props;

		return (
			<Tooltip tooltip="Обновить виджеты" placement="left">
				<div className={styles.buttonIcon}>
					<IconRefresh onClick={fetchDashboard} />
				</div>
			</Tooltip>
		);
	};

	renderResetButton = () => {
		const {editable, master, resetDashboard} = this.props;

		if (editable || master) {
			return (
				<div className={styles.buttonIcon} onClick={resetDashboard}>
					<CloseIcon />
					Сбросить настройки
				</div>
			);
		}
	};

	render () {
		return (
			<header className={styles.header}>
				<ul className={styles.nav}>
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
