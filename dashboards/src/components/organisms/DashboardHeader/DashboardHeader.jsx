// @flow
import {Button, DropDownFiles} from 'components/atoms';
import CloseIcon from 'icons/header/close.svg';
import {createSnapshot, FILE_VARIANTS} from 'utils/export';
import {gridRef} from 'components/organisms/LayoutGrid';
import IconRefresh from 'icons/header/refresh.svg';
import PrintIcon from 'icons/header/print.svg';
import React, {Component} from 'react';
import type {Props} from 'containers/DashboardHeader/types';
import styles from './styles.less';

const FileList = [
	{text: FILE_VARIANTS.PDF},
	{text: FILE_VARIANTS.PNG}
];

export class DashboardHeader extends Component<Props> {
	createDocument = (docStr: string) => {
		const {current} = gridRef;
		const {name} = this.props;

		if (current) {
			createSnapshot(current, name, docStr);
		}
	};

	resetWidgets = async () => {
		const {fetchDashboard, resetDashboard} = this.props;

		await resetDashboard();
		fetchDashboard();
	};

	renderResetButton = () => {
		const {editable, master} = this.props;

		if (editable || master) {
			return (
				<div className={styles.buttonIcon} onClick={this.resetWidgets}>
					<CloseIcon />
					Сбросить настройки
				</div>
			);
		}
	};

	renderPrintButton = () => <div className={styles.buttonIcon}><PrintIcon /></div>;

	renderModeButton = () => {
		const {editable, editDashboard, location, master, seeDashboard} = this.props;

		if (editable || master) {
			if (location.pathname === '/') {
				// TODO: инлайн стили временно
				return (
					<div style={{padding: '0 10px'}}>
						<Button type="button" onClick={editDashboard}>Редактировать</Button>
					</div>
				);
			}
			// TODO: инлайн стили временно
			return (
				<div style={{padding: '0 10px'}}>
					<Button type="button" onClick={seeDashboard}>Просмотреть</Button>;
				</div>
			);
		}
	};

	renderRefreshButton = () => {
		const {fetchDashboard} = this.props;

		return (
			<div className={styles.buttonIcon}>
				<IconRefresh onClick={fetchDashboard} />
			</div>
		);
	};

	renderDropDown = () => {
		return <DropDownFiles icon list={FileList} createDoc={this.createDocument} />;
	};

	render () {
		const {name} = this.props;

		return (
			<header className={styles.header}>
				<p className={styles.title}>Дашборд {`"${name}"`}</p>
				<ul className={styles.nav}>
					<li className={styles.navItem}>
						{this.renderDropDown()}
					</li>
					<li className={styles.navItem}>
						{this.renderRefreshButton()}
					</li>
					<li className={styles.navItem}>
						{this.renderResetButton()}
					</li>
					<li className={styles.navItem}>
						{this.renderModeButton()}
					</li>
					<li className={styles.navItem}>
						{this.renderPrintButton()}
					</li>
				</ul>
			</header>
		);
	}
}

export default DashboardHeader;
