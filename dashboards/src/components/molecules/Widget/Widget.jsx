// @flow
import {CloseIcon, EditIcon, UnionIcon} from 'icons/form';
import cn from 'classnames';
import {createOrdinalName, WIDGET_VARIANTS} from 'utils/widget';
import {createSnapshot, exportSheet, FILE_VARIANTS} from 'utils/export';
import {Diagram, Modal} from 'components/molecules';
import {ExportIcon} from 'icons/header';
import type {ExportItem, Props, State} from './types';
import {EXPORT_LIST} from './constants';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {FOOTER_POSITIONS, SIZES} from 'components/molecules/Modal/constants';
import {IconButton} from 'components/atoms';
import React, {createRef, PureComponent} from 'react';
import styles from './styles.less';

export class Widget extends PureComponent<Props, State> {
	static defaultProps = {
		className: ''
	};

	state = {
		hasError: false,
		showRemoveModal: false
	};

	ref = createRef();

	static getDerivedStateFromError (error: Object) {
		window.top.console.log(error);

		return {
			hasError: true
		};
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
		const {className, isSelected} = this.props;

		const CN = [className, styles.widget];

		if (isSelected) {
			CN.push(styles.selectedWidget);
		}

		return cn(CN);
	};

	handleClickDrillDownButton = (num?: number) => () => {
		const {data, onDrillDown} = this.props;
		onDrillDown(data, num);
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
					{this.renderDrillDownButton()}
					{this.renderRemoveButton()}
				</div>
			);
		}
	};

	renderDiagram = () => {
		const {buildData, data, isNew} = this.props;
		const {hasError} = this.state;

		if (!isNew && buildData && !hasError) {
			return <Diagram buildData={buildData} widget={data} />;
		}
	};

	renderDrillDownButton = () => {
		const {data: widget} = this.props;
		return Array.isArray(widget.order) ? this.renderDrillDownButtons() : this.renderLegacyDrillDownButton();
	};

	renderDrillDownButtons = () => {
		const {data: widget} = this.props;
		const {order} = widget;

		return order.map(number => {
			const sourceForCompute = widget[createOrdinalName(FIELDS.sourceForCompute, number)];

			if (!sourceForCompute) {
				const dataKey = widget[createOrdinalName(FIELDS.dataKey, number)];
				const source = widget[createOrdinalName(FIELDS.source, number)];
				let tipText = 'Перейти';

				if (source) {
					tipText = `${tipText} (${source.label})`;
				}

				return (
					<IconButton key={dataKey} onClick={this.handleClickDrillDownButton(number)} tip={tipText}>
						<UnionIcon />
					</IconButton>
				);
			}
		});
	};

	renderEditButton = () => {
		const {isEditable} = this.props;

		if (isEditable) {
			return (
				<IconButton onClick={this.handleClickEditButton} tip="Редактировать">
					<EditIcon />
				</IconButton>
			);
		}
	};

	renderError = () => {
		const {hasError} = this.state;

		if (hasError) {
			return (
				<div className={styles.error}>Ошибка построения.</div>
			);
		}
	};

	renderExportButton = () => {
		const {type} = this.props.data;
		const list = type !== WIDGET_VARIANTS.TABLE
			? EXPORT_LIST.filter(list => list.key !== FILE_VARIANTS.XLSX)
			: EXPORT_LIST;

		return (
			<IconButton tip={list.map(this.renderExportItem)}>
				<ExportIcon />
			</IconButton>
		);
	};

	renderExportItem = (item: ExportItem) => (
		<div className={styles.exportItem} data-type={item.key} key={item.key} onClick={this.handleClickExportButton}>
			{item.text}
		</div>
	);

	renderLegacyDrillDownButton = () => (
		<IconButton onClick={this.handleClickDrillDownButton()} tip="Перейти">
			<UnionIcon />
		</IconButton>
	);

	renderRemoveButton = () => {
		const {isEditable} = this.props;

		if (isEditable) {
			return (
				<IconButton onClick={this.handleClickRemoveButton} tip="Удалить">
					<CloseIcon />
					{this.renderRemoveModal()}
				</IconButton>
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
			<div {...gridProps} className={this.getClassName()} ref={this.ref}>
				{this.renderDiagram()}
				{this.renderButtons()}
				{this.renderError()}
				{children}
			</div>
		);
	}
}

export default Widget;
