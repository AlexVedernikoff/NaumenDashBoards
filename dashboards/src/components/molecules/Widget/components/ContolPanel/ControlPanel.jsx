// @flow
import cn from 'classnames';
import {DISPLAY_MODE, WIDGET_TYPES} from 'store/widgets/data/constants';
import {DISPLAY_MODE_OPTIONS} from 'store/widgets/constants';
import {DropDownButton} from 'components/molecules/Widget/components';
import {DropdownMenu, IconButton} from 'components/atoms';
import {EXPORT_LIST} from './constants';
import {FILE_VARIANTS} from 'utils/export';
import {FOOTER_POSITIONS, SIZES} from 'components/molecules/Modal/constants';
import {ICON_NAMES} from 'components/atoms/Icon';
import {Item as MenuItem, SubMenu} from 'rc-menu';
import {Modal} from 'components/molecules';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {USER_ROLES} from 'store/context/constants';
import {VARIANTS as ICON_BUTTON_VARIANTS} from 'components/atoms/IconButton/constants';

export class ControlPanel extends PureComponent<Props, State> {
	state = {
		showRemoveModal: false,
		showSubmenu: false
	};

	getDisplayModeIcon = () => {
		const {widget} = this.props;

		switch (widget.displayMode) {
			case DISPLAY_MODE.WEB:
				return ICON_NAMES.WEB;
			case DISPLAY_MODE.MOBILE:
				return ICON_NAMES.MOBILE;
			default:
				return ICON_NAMES.WEB_MK;
		}
	};

	handleChangeDisplayMode = ({value}: Object) => {
		const {editWidgetChunkData, widget} = this.props;
		editWidgetChunkData(widget, {displayMode: value});
	};

	handleClickDrillDownButton = (e: Object) => {
		const {onDrillDown, widget} = this.props;
		onDrillDown(widget, e.item.props.keyEvent);
	};

	handleClickExportItem = (e: Object) => this.props.onExport(e.key);

	handleClickRemoveButton = () => this.setState({showRemoveModal: true});

	handleCloseRemoveModal = () => this.setState({showRemoveModal: false});

	handleSubmitRemoveModal = () => {
		const {onRemove, widget} = this.props;

		this.setState({showRemoveModal: false});
		onRemove(widget.id);
	};

	handleToggleSubMenu = () => this.setState({showSubmenu: !this.state.showSubmenu});

	renderChangeDisplayModeButton = () => {
		const {personalDashboard, user, widget} = this.props;
		const value = DISPLAY_MODE_OPTIONS.find(item => item.value === widget.displayMode) || DISPLAY_MODE_OPTIONS[0];

		if (user.role !== USER_ROLES.REGULAR && !personalDashboard) {
			return (
				<DropDownButton
					buttonIcon={this.getDisplayModeIcon()}
					className={styles.markedIcon}
					menu={DISPLAY_MODE_OPTIONS}
					onSelect={this.handleChangeDisplayMode}
					tip={`Отображается ${value.label}`}
					value={value}
				/>
			);
		}

		return null;
	};

	renderDrillDownItems = (): Array<React$Node> | null => {
		const {widget} = this.props;

		// $FlowFixMe
		return widget.data.filter(set => !set.sourceForCompute).map((set, index) => {
			const {dataKey, source} = set;

			return (
				<MenuItem key={dataKey} keyEvent={index} onClick={this.handleClickDrillDownButton}>
					{source.label}
				</MenuItem>
			);
		});
	};

	renderEditButton = () => {
		const {isEditable, onEdit} = this.props;

		if (isEditable) {
			return (
				<IconButton icon={ICON_NAMES.EDIT} onClick={onEdit} round={false} tip="Редактировать" />
			);
		}

		return null;
	};

	renderExportItem = (item: string) => (
		<MenuItem eventKey={item} key={item} onClick={this.handleClickExportItem}>
			{item.toUpperCase()}
		</MenuItem>
	);

	renderRemoveMenuItem = () => {
		const {isEditable} = this.props;

		if (isEditable) {
			return (
				<MenuItem onClick={this.handleClickRemoveButton}>
					Удалить виджет
					{this.renderRemoveModal()}
				</MenuItem>
			);
		}
	};

	renderRemoveModal = () => {
		const {showRemoveModal} = this.state;

		if (showRemoveModal) {
			return (
				<Modal
					cancelText="Нет"
					footerPosition={FOOTER_POSITIONS.RIGHT}
					header="Подтверждение удаления"
					notice={true}
					onClose={this.handleCloseRemoveModal}
					onSubmit={this.handleSubmitRemoveModal}
					size={SIZES.SMALL}
					submitText="Да"
				>
					Вы действительно хотите удалить виджет?
				</Modal>
			);
		}
	};

	renderSubmenu = () => {
		const {widget} = this.props;
		const {showSubmenu} = this.state;
		const {type} = widget;
		const list = type !== WIDGET_TYPES.TABLE
			? EXPORT_LIST.filter(list => list !== FILE_VARIANTS.XLSX)
			: EXPORT_LIST;

		if (showSubmenu) {
			return (
				<DropdownMenu onSelect={this.handleToggleSubMenu} onToggle={this.handleToggleSubMenu}>
					<SubMenu popupClassName="popupSubmenu" title={<span>Источники</span>}>
						{this.renderDrillDownItems()}
					</SubMenu >
					<SubMenu popupClassName="popupSubmenu" title={<span>Экспорт</span>}>
						{list.map(this.renderExportItem)}
					</SubMenu>
					{this.renderRemoveMenuItem()}
				</DropdownMenu>
			);
		}

		return null;
	};

	renderSubmenuButton = () => {
		const {showSubmenu} = this.state;

		return (
			<div className="header-submenu">
				<IconButton
					active={showSubmenu}
					icon={ICON_NAMES.KEBAB}
					onClick={this.handleToggleSubMenu}
					round={false}
					tip="Меню"
					variant={ICON_BUTTON_VARIANTS.GRAY}
				/>
				{this.renderSubmenu()}
			</div>
		);
	};

	render () {
		const {className} = this.props;

		return (
			<div className={cn(styles.panel, className)}>
				{this.renderChangeDisplayModeButton()}
				{this.renderEditButton()}
				{this.renderSubmenuButton()}
			</div>
		);
	}
}

export default ControlPanel;
