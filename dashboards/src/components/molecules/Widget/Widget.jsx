// @flow
import {CHART_VARIANTS} from 'utils/chart';
import {CloseIcon, EditIcon, UnionIcon} from 'icons/form';
import cn from 'classnames';
import {createName, createSnapshot, FILE_LIST} from 'utils/export';
import {createOrderName} from 'utils/widget';
import {Diagram} from 'components/molecules';
import {ExportIcon} from 'icons/header';
import type {ExportItem, Props} from './types';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {IconButton} from 'components/atoms';
import React, {createRef, Fragment, PureComponent} from 'react';
import styles from './styles.less';

export class Widget extends PureComponent<Props> {
	ref = createRef();

	handleClickComboDrillDownButton = (num: number) => () => {
		const {data, onDrillDown} = this.props;
		onDrillDown(data, num);
	};

	handleClickDrillDownButton = () => {
		const {data, onDrillDown} = this.props;
		onDrillDown(data);
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
					{this.renderDrillDownButtonByType()}
					{this.renderRemoveButton()}
				</div>
			);
		}
	};

	renderDiagram = () => {
		const {data, diagram, isNew} = this.props;

		if (!isNew && diagram) {
			return <Diagram diagram={diagram} widget={data} />;
		}
	};

	renderDrillDownButton = () => (
		<IconButton tip="Перейти" onClick={this.handleClickDrillDownButton}>
			<UnionIcon />
		</IconButton>
	);

	renderDrillDownButtonByType = () => {
		const {type} = this.props.data;

		if (type === CHART_VARIANTS.COMBO) {
			return this.renderDrillDownButtons();
		}

		return this.renderDrillDownButton();
	};

	renderDrillDownButtons = () => {
		const {data} = this.props;
		const {order} = data;

		if (Array.isArray(order)) {
			return order.map(num => {
				const createName = createOrderName(num);
				const dataKey = data[createName(FIELDS.dataKey)];
				const source = data[createName(FIELDS.source)];
				let tipText = 'Перейти';

				if (source) {
					tipText = `${tipText} (${source.label})`;
				}

				return (
					<IconButton key={dataKey} onClick={this.handleClickComboDrillDownButton(num)} tip={tipText}>
						<UnionIcon />
					</IconButton>
				);
			});
		}
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
		const {isSelected} = this.props;
		const widgetCN = isSelected ? cn([styles.widget, styles.selectedWidget]) : styles.widget;

		return (
			<div className={widgetCN} ref={this.ref}>
				{this.renderDiagram()}
				{this.renderButtons()}
			</div>
		);
	}
}

export default Widget;
