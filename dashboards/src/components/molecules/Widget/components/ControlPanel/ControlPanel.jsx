// @flow
import cn from 'classnames';
import {DIAGRAM_WIDGET_TYPES, DISPLAY_MODE, WIDGET_TYPES} from 'store/widgets/data/constants';
import {DISPLAY_MODE_OPTIONS} from 'store/widgets/constants';
import DropDownButton from 'components/molecules/Widget/components/DropDownButton';
import DropdownMenu from 'components/atoms/DropdownMenu';
import {EXPORT_LIST} from './constants';
import {FILE_VARIANTS} from 'utils/export';
import {FOOTER_POSITIONS, SIZES} from 'components/molecules/Modal/constants';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import {Item as MenuItem, SubMenu} from 'rc-menu';
import Modal from 'components/molecules/Modal';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
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

	handleClick = (e: SyntheticMouseEvent<HTMLDivElement>) => e.stopPropagation();

	handleClickDrillDownButton = (e: Object) => {
		const {onDrillDown, widget} = this.props;
		onDrillDown(widget, e.item.props.keyEvent);
	};

	handleClickExportItem = (e: Object) => this.props.onExport(e.key);

	handleClickNavigationButton = () => {
		const {onOpenNavigationLink, widget} = this.props;
		const {dashboard, widget: navigationWidget} = widget.navigation;

		if (dashboard) {
			const widgetId = navigationWidget ? navigationWidget.value : '';
			onOpenNavigationLink(dashboard.value, widgetId);
		}
	};

	handleClickRemoveButton = () => this.setState({showRemoveModal: true});

	handleCloseRemoveModal = () => this.setState({showRemoveModal: false});

	handleSubmitRemoveModal = () => {
		const {onRemove, widget} = this.props;

		this.setState({showRemoveModal: false});
		onRemove(widget.id);
	};

	handleToggleSubMenu = () => this.setState({showSubmenu: !this.state.showSubmenu});

	renderButtonSubmenu = () => {
		const {type} = this.props.widget;
		const {showSubmenu} = this.state;

		if (showSubmenu) {
			return type in DIAGRAM_WIDGET_TYPES ? this.renderDiagramSubmenu() : this.renderSimpleSubmenu();
		}

		return null;
	};

	renderChangeDisplayModeButton = () => {
		const {isEditable, widget} = this.props;
		const value = DISPLAY_MODE_OPTIONS.find(item => item.value === widget.displayMode) || DISPLAY_MODE_OPTIONS[0];

		if (isEditable) {
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

	renderDiagramSubmenu = () => {
		const {type} = this.props.widget;
		const exportList = type !== WIDGET_TYPES.TABLE
			? EXPORT_LIST.filter(list => list !== FILE_VARIANTS.XLSX)
			: EXPORT_LIST;

		return (
			<DropdownMenu onSelect={this.handleToggleSubMenu} onToggle={this.handleToggleSubMenu}>
				{this.renderSubmenu(<span>Источники</span>, this.renderDrillDownItems())}
				{this.renderSubmenu(<span>Экспорт</span>, exportList.map(this.renderExportItem))}
				{this.renderRemoveMenuItem()}
			</DropdownMenu>
		);
	};

	renderDrillDownItems = (): Array<React$Node> | null => {
		const {widget} = this.props;

		// $FlowFixMe
		return widget.data.filter(set => !set.sourceForCompute).map((set, index) => {
			const {dataKey, source} = set;

			return (
				<MenuItem key={dataKey} keyEvent={index} onClick={this.handleClickDrillDownButton}>
					{source.value.label}
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

	renderNavigationButton = () => {
		const {navigation, type} = this.props.widget;

		if (type in DIAGRAM_WIDGET_TYPES && navigation.show) {
			let {showTip, tip} = navigation;

			if (!showTip) {
				tip = '';
			}

			return (
				<IconButton
					icon={ICON_NAMES.EXTERNAL_LINK}
					onClick={this.handleClickNavigationButton}
					round={false}
					tip={tip}
				/>
			);
		}

		return null;
	};

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

		return null;
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

	renderSimpleSubmenu = () => {
		const {showSubmenu} = this.state;

		if (showSubmenu) {
			return (
				<DropdownMenu onSelect={this.handleToggleSubMenu} onToggle={this.handleToggleSubMenu}>
					{this.renderRemoveMenuItem()}
				</DropdownMenu>
			);
		}

		return null;
	};

	renderSubmenu = (title: React$Node, content: React$Node) => (
		<SubMenu popupClassName="popupSubmenu" title={title}>
			{content}
		</SubMenu >
	);

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
				{this.renderButtonSubmenu()}
			</div>
		);
	};

	render () {
		const {className} = this.props;

		return (
			<div className={cn(styles.panel, className)} onClick={this.handleClick}>
				{this.renderNavigationButton()}
				{this.renderChangeDisplayModeButton()}
				{this.renderEditButton()}
				{this.renderSubmenuButton()}
			</div>
		);
	}
}

export default ControlPanel;
