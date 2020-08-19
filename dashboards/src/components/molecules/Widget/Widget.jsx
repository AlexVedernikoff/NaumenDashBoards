// @flow
import cn from 'classnames';
import {createSnapshot, exportSheet, FILE_VARIANTS} from 'utils/export';
import {Diagram, Modal} from 'components/molecules';
import {DISPLAY_MODE, WIDGET_TYPES} from 'store/widgets/data/constants';
import {DISPLAY_MODE_OPTIONS} from 'store/widgets/constants';
import type {DivRef} from 'components/types';
import {DropDownButton} from './components';
import {DropdownMenu, IconButton} from 'components/atoms';
import type {ExportItem, Props, State} from './types';
import {EXPORT_LIST} from './constants';
import {FOOTER_POSITIONS, SIZES} from 'components/molecules/Modal/constants';
import {ICON_NAMES} from 'components/atoms/Icon';
import {Item as MenuItem, SubMenu} from 'rc-menu';
import NewWidget from 'store/widgets/data/NewWidget';
import type {Node} from 'react';
import React, {createRef, PureComponent} from 'react';
import styles from './styles.less';
import {USER_ROLES} from 'store/context/constants';
import {VARIANTS as ICON_BUTTON_VARIANTS} from 'components/atoms/IconButton/constants';

export class Widget extends PureComponent<Props, State> {
	static defaultProps = {
		className: ''
	};

	state = {
		hasError: false,
		layoutModeValue: this.props.displayMode,
		showRemoveModal: false,
		showSubmenu: false
	};

	ref: DivRef = createRef();

	static getDerivedStateFromError (error: Object) {
		window.top.console.log(error);

		return {
			hasError: true
		};
	}

	componentDidMount () {
		const {buildData, data, fetchBuildData} = this.props;

		if (data.id !== NewWidget.id && !buildData) {
			fetchBuildData(data);
		}
	}

	componentDidUpdate (prevProps: Props) {
		if (prevProps.buildData) {
			const {buildData: {loading: nextLoading, updateDate: nextUpdateDate}} = prevProps;
			const {buildData: {loading: prevLoading, updateDate: prevUpdateDate}} = this.props;

			if (nextLoading !== prevLoading || nextUpdateDate !== prevUpdateDate) {
				this.setState({hasError: false});
			}
		}
	}

	getClassName = () => {
		const {className, focused, isSelected} = this.props;

		return cn({
			[styles.widget]: true,
			[styles.focusedWidget]: focused,
			[styles.selectedWidget]: isSelected,
			[className]: true
		});
	};

	getDisplayModeIcon = () => {
		const {displayMode} = this.props;

		switch (displayMode) {
			case DISPLAY_MODE.WEB:
				return ICON_NAMES.WEB;
			case DISPLAY_MODE.MOBILE:
				return ICON_NAMES.MOBILE;
			default:
				return ICON_NAMES.WEB_MK;
		}
	};

	getHeaderButtonClassName = () => {
		const {showSubmenu} = this.state;

		return cn({
			[styles.actionHeaderButtonsContainer]: true,
			[styles.showHeaderButtons]: showSubmenu
		});
	};

	handleChangeDisplayMode = ({value}: Object) => {
		const {data, editWidgetChunkData} = this.props;
		editWidgetChunkData(data, {displayMode: value});
	};

	handleClick = (e: MouseEvent) => {
		const {data, onClick} = this.props;

		e.stopPropagation();
		onClick(data.id);
	};

	handleClickDrillDownButton = (index: number) => () => {
		const {data, onDrillDown} = this.props;
		onDrillDown(data, index);
	};

	handleClickEditButton = () => {
		const {data, onEdit} = this.props;
		onEdit(data.id);
	};

	handleClickExportButton = (e: SyntheticMouseEvent<HTMLDivElement>) => {
		const {buildData, data} = this.props;
		const {name} = data;
		const {current} = this.ref;
		const {type} = e.currentTarget.dataset;

		if (type === FILE_VARIANTS.XLSX) {
			return exportSheet(name, buildData.data);
		}

		if (current) {
			createSnapshot({
				container: current,
				fragment: true,
				name,
				toDownload: true,
				type
			});
		}
	};

	handleClickRemoveButton = () => this.setState({showRemoveModal: true});

	handleCloseRemoveModal = () => this.setState({showRemoveModal: false});

	handleCloseSubMenu = () => this.setState({showSubmenu: false});

	handleSubmitRemoveModal = () => {
		const {data, onRemove} = this.props;

		this.setState({showRemoveModal: false});
		onRemove(data.id);
	};

	handleToogleSubMenu = () => this.setState({showSubmenu: !this.state.showSubmenu});

	renderChangeDisplayModeButton = () => {
		const {displayMode, personalDashboard, user} = this.props;
		const value = DISPLAY_MODE_OPTIONS.find(item => item.value === displayMode) || DISPLAY_MODE_OPTIONS[0];

		if (user.role !== USER_ROLES.REGULAR && !personalDashboard) {
			return (
				<DropDownButton
					buttonIcon={this.getDisplayModeIcon()}
					className={styles.markerIcon}
					menu={DISPLAY_MODE_OPTIONS}
					onSelect={this.handleChangeDisplayMode}
					tip={`Отображается ${value.label}`}
					value={value}
				/>
			);
		}

		return null;
	};

	renderDiagram = () => {
		const {buildData, data, focused, isNew, onUpdate} = this.props;
		const {hasError, showSubmenu} = this.state;

		if (!isNew && buildData && !hasError) {
			return <Diagram buildData={buildData} focused={focused} onUpdate={onUpdate} showSubmenu={showSubmenu} widget={data} />;
		}
	};

	renderDrillDownItems = (): Array<Node> | null => {
		const {data: widget} = this.props;

		// $FlowFixMe
		return widget.data.filter(set => !set.sourceForCompute).map((set, index) => {
			const {dataKey, source} = set;

			return (
				<MenuItem key={dataKey} onClick={this.handleClickDrillDownButton(index)}>
					{source.label}
				</MenuItem>
			);
		});
	};

	renderEditButton = () => {
		const {isEditable} = this.props;

		if (isEditable) {
			return (
				<IconButton icon={ICON_NAMES.EDIT} onClick={this.handleClickEditButton} round={false} tip="Редактировать" />
			);
		}

		return null;
	};

	renderError = () => {
		const {hasError} = this.state;
		const message = 'Ошибка построения.';

		if (hasError) {
			return (
				<div className={styles.error} title={message}>{message}</div>
			);
		}
	};

	renderExportItem = (item: ExportItem) => (
		<MenuItem key={item.key}>
			<div className={styles.exportItem} data-type={item.key} onClick={this.handleClickExportButton}>
				{item.text.toUpperCase()}
			</div>
		</MenuItem>
	);

	renderFilterButton = () => {
		const {isEditable} = this.props;

		if (isEditable) {
			return (
				<IconButton icon={ICON_NAMES.FILTER} onClick={() => console.log('renderFilterButton')} round={false} tip="Фильтрация" />
			);
		}

		return null;
	};

	renderHeaderButtons = () => {
		const {isNew} = this.props;

		if (!isNew) {
			return (
				<div className={this.getHeaderButtonClassName()}>
					{this.renderChangeDisplayModeButton()}
					{this.renderEditButton()}
					{/* Данный функционал на время отключен
					{this.renderFilterButton()}
					{this.renderSquareButton()} */}
					{this.renderKebabButton()}
				</div>
			);
		}

		return null;
	};

	renderKebabButton = () => {
		const {showSubmenu} = this.state;
		return (
			<div className="header-submenu">
				<IconButton
					active={showSubmenu}
					icon={ICON_NAMES.KEBAB}
					onClick={this.handleToogleSubMenu}
					round={false}
					tip="Меню"
					variant={ICON_BUTTON_VARIANTS.GRAY}
				/>
				{this.renderSubmenu()}
			</div>
		);
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

	renderSquareButton = () => {
		const {isEditable} = this.props;

		if (isEditable) {
			return (
				<IconButton
					icon={ICON_NAMES.SQUARE}
					onClick={() => console.log('renderSquareButton')}
					round={false} tip="Таблица данных"
				/>
			);
		}

		return null;
	};

	renderSubmenu = () => {
		const {showSubmenu} = this.state;
		const {isEditable} = this.props;
		const {type} = this.props.data;
		const list = type !== WIDGET_TYPES.TABLE
			? EXPORT_LIST.filter(list => list.key !== FILE_VARIANTS.XLSX)
			: EXPORT_LIST;

		if (showSubmenu) {
			return (
				<DropdownMenu onSelect={this.handleCloseSubMenu} onToggle={this.handleCloseSubMenu}>
					<SubMenu popupClassName="popupSubmenu" title={<span>Источники</span>}>
						{this.renderDrillDownItems()}
					</SubMenu>
					<SubMenu popupClassName="popupSubmenu" title={<span>Экспорт</span>}>
						{list.map(this.renderExportItem)}
					</SubMenu>
					{isEditable && <MenuItem onClick={this.handleClickRemoveButton}>
						Удалить виджет
						{this.renderRemoveModal()}
					</MenuItem>}
				</DropdownMenu>
			);
		}

		return null;
	};

	render () {
		const {children, onMouseDown, onMouseUp, onTouchEnd, onTouchStart, style} = this.props;
		const gridProps = {
			onMouseDown,
			onMouseUp,
			onTouchEnd,
			onTouchStart,
			style
		};

		return (
			<div {...gridProps} className={this.getClassName()} onClick={this.handleClick} ref={this.ref}>
				{this.renderDiagram()}
				{this.renderHeaderButtons()}
				{this.renderError()}
				{children}
			</div>
		);
	}
}

export default Widget;
