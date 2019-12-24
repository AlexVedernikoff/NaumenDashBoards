// @flow
import {CloseIcon, EditIcon, UnionIcon} from 'icons/form';
import cn from 'classnames';
import {createName, createSnapshot, FILE_LIST} from 'utils/export';
import {createOrdinalName} from 'utils/widget';
import {Diagram} from 'components/molecules';
import {ExportIcon} from 'icons/header';
import type {ExportItem, Props, State} from './types';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {IconButton} from 'components/atoms';
import React, {createRef, Fragment, PureComponent} from 'react';
import styles from './styles.less';

export class Widget extends PureComponent<Props, State> {
	static defaultProps = {
		className: ''
	};

	state = {
		hasError: false
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

	handleClickExportButton = async (e: SyntheticMouseEvent<HTMLDivElement>) => {
		const {data} = this.props;
		const {current} = this.ref;
		const {type} = e.currentTarget.dataset;
		let name = await createName();
		name = `${data.name}_${name}`;

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

	handleClickRemoveButton = () => {
		const {data, onRemove} = this.props;
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
		const list = FILE_LIST.map(this.renderExportItem);

		return (
			<IconButton tip={list}>
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
		<IconButton tip="Перейти" onClick={this.handleClickDrillDownButton()}>
			<UnionIcon />
		</IconButton>
	);

	renderRemoveButton = () => {
		const {isEditable} = this.props;

		if (isEditable) {
			return (
				<Fragment>
					<IconButton onClick={this.handleClickRemoveButton} tip="Удалить">
						<CloseIcon />
					</IconButton>
				</Fragment>
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
