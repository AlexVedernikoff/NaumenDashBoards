// @flow
import cn from 'classnames';
import {createSnapshot, exportSheet, FILE_VARIANTS} from 'utils/export';
import {Diagram, Modal} from 'components/molecules';
import {DISPLAY_MODE, WIDGET_TYPES} from 'store/widgets/data/constants';
import {DISPLAY_MODE_OPTIONS} from 'store/widgets/constants';
import type {DivRef} from 'components/types';
import {DropDownButton} from './components';
import type {ExportItem, Props, State} from './types';
import {EXPORT_LIST} from './constants';
import {FOOTER_POSITIONS, SIZES} from 'components/molecules/Modal/constants';
import {IconButton, Tooltip} from 'components/atoms';
import {ICON_NAMES} from 'components/atoms/Icon';
import NewWidget from 'store/widgets/data/NewWidget';
import type {Node} from 'react';
import React, {createRef, Fragment, PureComponent} from 'react';
import styles from './styles.less';
import {USER_ROLES} from 'store/context/constants';

export class Widget extends PureComponent<Props, State> {
	static defaultProps = {
		className: ''
	};

	state = {
		hasError: false,
		showRemoveModal: false
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

	handleSubmitRemoveModal = () => {
		const {data, onRemove} = this.props;

		this.setState({showRemoveModal: false});
		onRemove(data.id);
	};

	renderButtons = () => {
		const {isNew} = this.props;

		if (!isNew) {
			return (
				<div className={styles.actionButtonsContainer}>
					{this.renderEditButton()}
					{this.renderExportButton()}
					{this.renderDrillDownButtons()}
					{this.renderRemoveButton()}
				</div>
			);
		}

		return null;
	};

	renderChangeDisplayModeButton = () => {
		const {displayMode} = this.props;
		const value = DISPLAY_MODE_OPTIONS.find(item => item.value === displayMode) || DISPLAY_MODE_OPTIONS[0];

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
	};

	renderDiagram = () => {
		const {buildData, data, focused, isNew, onUpdate} = this.props;
		const {hasError} = this.state;

		if (!isNew && buildData && !hasError) {
			return <Diagram buildData={buildData} focused={focused} onUpdate={onUpdate} widget={data} />;
		}
	};

	renderDrillDownButtons = (): Array<Node> | null => {
		const {data: widget} = this.props;

		// $FlowFixMe
		return widget.data.filter(set => !set.sourceForCompute).map((set, index) => {
			const {dataKey, source} = set;
			let tipText = 'Перейти';

			if (source) {
				tipText = `${tipText} (${source.label})`;
			}

			return (
				<IconButton
					icon={ICON_NAMES.DATA}
					key={dataKey}
					onClick={this.handleClickDrillDownButton(index)}
					tip={tipText}
				/>
			);
		});
	};

	renderEditButton = () => {
		const {isEditable} = this.props;

		if (isEditable) {
			return (
				<IconButton icon={ICON_NAMES.EDIT} onClick={this.handleClickEditButton} tip="Редактировать" />
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

	renderExportButton = () => {
		const {type} = this.props.data;
		const list = type !== WIDGET_TYPES.TABLE
			? EXPORT_LIST.filter(list => list.key !== FILE_VARIANTS.XLSX)
			: EXPORT_LIST;

		return (
			<Tooltip text={list.map(this.renderExportItem)}>
				<IconButton icon={ICON_NAMES.DOWNLOAD} tip="Выгрузить" />
			</Tooltip>
		);
	};

	renderExportItem = (item: ExportItem) => (
		<div className={styles.exportItem} data-type={item.key} key={item.key} onClick={this.handleClickExportButton}>
			{item.text}
		</div>
	);

	renderHeaderButtons = () => {
		const {isNew, personalDashboard, user} = this.props;

		if (!isNew && user.role !== USER_ROLES.REGULAR && !personalDashboard) {
			return (
				<div className={styles.actionHeaderButtonsContainer}>
					{this.renderChangeDisplayModeButton()}
				</div>
			);
		}

		return null;
	};

	renderRemoveButton = () => {
		const {isEditable} = this.props;

		if (isEditable) {
			return (
				<Fragment>
					<IconButton icon={ICON_NAMES.CLOSE} onClick={this.handleClickRemoveButton} tip="Удалить" />
					{this.renderRemoveModal()}
				</Fragment>
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
				{this.renderButtons()}
				{this.renderHeaderButtons()}
				{this.renderError()}
				{children}
			</div>
		);
	}
}

export default Widget;
