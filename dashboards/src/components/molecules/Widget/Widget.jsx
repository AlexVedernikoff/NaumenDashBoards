// @flow
import cn from 'classnames';
import {createSnapshot, exportSheet, FILE_VARIANTS} from 'utils/export';
import {Diagram, Modal} from 'components/molecules';
import type {DivRef} from 'components/types';
import type {ExportItem, Props, State} from './types';
import {EXPORT_LIST} from './constants';
import {FOOTER_POSITIONS, SIZES} from 'components/molecules/Modal/constants';
import {IconButton, Tooltip} from 'components/atoms';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {Node} from 'react';
import React, {createRef, Fragment, PureComponent} from 'react';
import styles from './styles.less';
import {usesUnsupportedDrillDownGroup} from 'store/widgets/helpers';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

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

	renderDiagram = () => {
		const {buildData, data, isNew, onUpdate} = this.props;
		const {hasError} = this.state;

		if (!isNew && buildData && !hasError) {
			return <Diagram buildData={buildData} onUpdate={onUpdate} widget={data} />;
		}
	};

	renderDrillDownButtons = (): Array<Node> | null => {
		const {data: widget} = this.props;
		const isSupportedDrillDown = !usesUnsupportedDrillDownGroup(widget);

		if (isSupportedDrillDown) {
			// $FlowFixMe
			return widget.data.map((set, index) => {
				const {dataKey, source, sourceForCompute} = set;

				if (!sourceForCompute) {
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
				}
			});
		}

		return null;
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

		if (hasError) {
			return (
				<div className={styles.error}>Ошибка построения.</div>
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
