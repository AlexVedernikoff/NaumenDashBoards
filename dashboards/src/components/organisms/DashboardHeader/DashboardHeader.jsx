// @flow
import AutoUpdateButton from 'containers/AutoUpdateButton';
import Button, {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button';
import ButtonGroup from 'components/atoms/ButtonGroup';
import {DASHBOARD_HEADER_HEIGHT, EXPORT_LIST} from './constants';
import {DEFAULT_BUTTONS, FOOTER_POSITIONS, SIZES as MODAL_SIZES} from 'components/molecules/Modal/constants';
import DropDownButton from './components/DropDownButton';
import ExportByEmailButton from './components/ExportByEmailButton';
import exporter from 'utils/export';
import {FILE_VARIANTS} from 'utils/export/constants';
import {gridRef} from 'components/organisms/WidgetsGrid/constants';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import IconButton from './components/IconButton';
import isMobile from 'ismobilejs';
import {LAYOUT_MODE} from 'store/dashboard/settings/constants';
import NavItem from './components/NavItem';
import type {Props} from 'containers/DashboardHeader/types';
import React, {Component} from 'react';
import styles from './styles.less';
import t from 'localization';
import T from 'components/atoms/Translation';
import {USER_ROLES} from 'store/context/constants';
import {VARIANTS as ICON_BUTTON_VARIANTS} from './components/IconButton/constants';

export class DashboardHeader extends Component<Props> {
	confirmRemovePersonalDashboard = async (): Promise<boolean> => {
		const {confirm} = this.props;
		const result = await confirm(
			t('DashboardHeader::DeleteConfirmation'),
			t('DashboardHeader::DeleteYourPersonalDashboard'),
			{
				cancelText: t('DashboardHeader::No'),
				defaultButton: DEFAULT_BUTTONS.CANCEL_BUTTON,
				footerPosition: FOOTER_POSITIONS.RIGHT,
				size: MODAL_SIZES.SMALL,
				submitText: t('DashboardHeader::Yes')
			}
		);

		return result;
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

	removePersonalDashboard = async () => {
		const {removePersonalDashboard} = this.props;

		if (await this.confirmRemovePersonalDashboard()) {
			removePersonalDashboard();
		}
	};

	togglePanel = () => {
		const {changeShowHeader, showHeader} = this.props;
		return changeShowHeader(!showHeader);
	};

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
		const {isEditableContext, isUserMode, layoutMode, user} = this.props;
		const isMobileLayoutMode = layoutMode === LAYOUT_MODE.MOBILE;
		const customTip = isMobileLayoutMode ? t('DashboardHeader::WebSwitch') : t('DashboardHeader::MobileSwitch');

		if (!isUserMode && user.role !== USER_ROLES.REGULAR && !isEditableContext) {
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
				tip={t('DashboardHeader::Download')}
			/>
		</NavItem>
	);

	renderDrawControl = () => {
		const {showHeader} = this.props;
		const top = (showHeader ? DASHBOARD_HEADER_HEIGHT : 0) - 12;
		const style = {top};
		const icon = showHeader ? ICON_NAMES.SIDEBAR_ROUND_UP : ICON_NAMES.SIDEBAR_ROUND_DOWN;
		const title = showHeader ? t('DashboardHeader::CollapseTopPanel') : t('DashboardHeader::ExpandTopPanel');

		return (
			<div className={styles.drawControl} onClick={this.togglePanel} style={style}>
				<Icon name={icon} title={title} />
			</div>
		);
	};

	renderMailExportButton = () => (
		<NavItem>
			<ExportByEmailButton />
		</NavItem>
	);

	renderModeButton = () => {
		const {editDashboard, editMode, isEditableContext, seeDashboard, user} = this.props;

		if (user.role !== USER_ROLES.REGULAR || isEditableContext) {
			return editMode
				? this.renderNavButton(t('DashboardHeader::View'), seeDashboard)
				: this.renderNavButton(t('DashboardHeader::Edit'), editDashboard);
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
			<IconButton name={ICON_NAMES.REFRESH} onClick={this.handleClickRefreshButton} tip={t('DashboardHeader::RefreshWidgets')} />
		</NavItem>
	);

	renderRemoveButton = () => {
		const {personalDashboard, personalDashboardDeleting} = this.props;

		if (personalDashboard) {
			return (
				<NavItem>
					<Button disabled={personalDashboardDeleting} onClick={this.removePersonalDashboard} outline>
						<Icon className={styles.removeIcon} name={ICON_NAMES.CLOSE} />
						<span><T text="DashboardHeader::Delete" /></span>
					</Button>
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
			return this.renderNavButton(t('DashboardHeader::SaveYourself'), createPersonalDashboard, personalDashboardCreating);
		}
	};

	renderSwitchDashboardButton = () => {
		const {isUserMode, personalDashboard, switching, user} = this.props;
		const {hasPersonalDashboard} = user;

		if (!isUserMode && hasPersonalDashboard) {
			return (
				<NavItem>
					<ButtonGroup disabled={switching}>
						<Button onClick={this.handleClickSwitchButton(true)} outline={!personalDashboard} variant={BUTTON_VARIANTS.GREEN}>
							<T text="DashboardHeader::Personal" />
						</Button>
						<Button onClick={this.handleClickSwitchButton(false)} outline={personalDashboard} variant={BUTTON_VARIANTS.GREEN}>
							<T text="DashboardHeader::Common" />
						</Button>
					</ButtonGroup>
				</NavItem>
			);
		}
	};

	render () {
		if (!isMobile().any) {
			const {showHeader} = this.props;

			if (showHeader) {
				return (
					<header className={styles.header} style={{height: DASHBOARD_HEADER_HEIGHT}}>
						<ul className={styles.nav}>
							{this.renderSwitchDashboardButton()}
						</ul>
						{this.renderDisplayModeButton()}
						{this.renderControls()}
						{this.renderDrawControl()}
					</header>
				);
			} else {
				return this.renderDrawControl();
			}
		}

		return null;
	}
}

export default DashboardHeader;
