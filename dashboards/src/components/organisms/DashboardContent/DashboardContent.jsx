// @flow
import {BREAKPOINTS, COLS, CONTAINER_PADDING, ROW_HEIGHT} from './constants';
import type {Layout} from 'utils/layout/types';
import {NewWidget} from 'utils/widget';
import type {Props} from 'containers/DashboardContent/types';
import React, {Component, createRef} from 'react';
import {Responsive as Grid} from 'react-grid-layout';
import type {State} from './types';
import styles from './styles.less';
import {Widget, WidgetRemovalModal} from 'components/molecules';
import type {Widget as WidgetType} from 'store/widgets/data/types';
import WidgetAddPanel from 'containers/WidgetAddPanel';
import WidgetFormPanel from 'containers/WidgetFormPanel';

export const gridRef = createRef();

export class DashboardContent extends Component<Props, State> {
	gridContainerRef = createRef();
	newWidgetRef = createRef();
	state = {
		newWidgetFocused: false,
		showRemovalModal: false,
		widgetIdToRemove: '',
		width: null
	};

	/**
	 * Для использования адаптивности библиотеки "react-grid-layout",
	 * необходимо указать точную ширину рабочей области. Обернув компонент Layout
	 * в обычный div, у нас появляется возможность, после первичного рендера, взять его ширину
	 * и пробросить ее в дочерний компонент, тем самым задав сетке виджетов оптимальную ширину.
	 */
	componentDidMount () {
		const {current: gridContainer} = gridRef;

		if (gridContainer) {
			const width: number = gridContainer.clientWidth;

			this.setState({width});
			window.addEventListener('resize', this.reloadGrid);
		}
	}

	componentDidUpdate () {
		const {editable} = this.props;

		if (editable) {
			const {current: grid} = gridRef;
			const {current: newWidget} = this.newWidgetRef;
			const {current: container} = this.gridContainerRef;
			const {newWidgetFocused} = this.state;

			if (newWidget && container && grid && !newWidgetFocused) {
				container && container.scrollTo(0, grid.clientHeight);
				this.setState(() => ({newWidgetFocused: true}));
			} else if (!newWidget && newWidgetFocused) {
				this.setState(() => ({newWidgetFocused: false}));
			}
		}
	}

	getWidgets = () => {
		const {newWidget, widgets} = this.props;

		if (newWidget) {
			return [...widgets, newWidget];
		}

		return widgets;
	};

	handleLayoutChange = (layout: Layout) => this.props.editLayout(layout);

	handleWidgetSelect = (widgetId: string) => {
		const {selectWidget, selectedWidget} = this.props;

		if (widgetId !== selectedWidget) 	{
			selectWidget(widgetId);
		}
	};

	hideRemovalModal = () => this.setState({showRemovalModal: false, widgetIdToRemove: ''});

	reloadGrid = () => {
		const {current} = gridRef;

		if (current) {
			const width: number = current.clientWidth;
			this.setState({width});
		}
	};

	removeWidget = (onlyPersonal: boolean) => {
		const {removeWidget} = this.props;
		const {widgetIdToRemove} = this.state;

		this.hideRemovalModal();
		removeWidget(widgetIdToRemove, onlyPersonal);
	};

	showRemovalModal = (widgetIdToRemove: string) => this.setState({showRemovalModal: true, widgetIdToRemove});

	renderGrid = () => {
		const {selectedWidget} = this.props;
		const {width} = this.state;
		const isEditable = !!selectedWidget;
		const widgets = this.getWidgets();

		if (width) {
			return (
				<Grid
					breakpoints={BREAKPOINTS}
					cols={COLS}
					compactType={null}
					containerPadding={CONTAINER_PADDING}
					isDraggable={isEditable}
					isResizable={isEditable}
					onLayoutChange={this.handleLayoutChange}
					rowHeight={ROW_HEIGHT}
					width={width}
				>
					{widgets.map(this.renderWidget)}
				</Grid>
			);
		}
	};

	renderGridWithContainer = () => {
		const {editMode} = this.props;
		const containerCN = editMode ? styles.editModeContainer : styles.viewModeContainer;

		return (
			<div className={containerCN} ref={this.gridContainerRef}>
				<div ref={gridRef}>
					{this.renderGrid()}
					{this.renderRemovalModal()}
				</div>
			</div>
		);
	};

	renderRemovalModal = () => {
		const {role} = this.props;
		const {showRemovalModal} = this.state;

		if (showRemovalModal) {
			return <WidgetRemovalModal onClose={this.hideRemovalModal} onSubmit={this.removeWidget} role={role} />;
		}
	};

	renderRightPanel = () => {
		const {editMode, selectedWidget} = this.props;

		if (editMode) {
			return (
				<div className={styles.panel}>
					{selectedWidget ? <WidgetFormPanel /> : <WidgetAddPanel />}
				</div>
			);
		}
	};

	renderWidget = (widget: WidgetType) => {
		const {buildData, drillDown, editable, selectedWidget} = this.props;
		const {id, layout} = widget;
		const isNew = id === NewWidget.id;
		const ref = isNew ? this.newWidgetRef : null;
		/*
			Раньше использовалось свойство static, для включения\отключения drag`n`drop, но у него наблюдаются проблемы с
			динамическим изменением значения. Поэтому теперь используются 2 свойства - isResizable и isDraggable. Свойство static
			необходимо удалять, т.к оно перебивает значения isResizable и isDraggable.
		 */
		delete layout.static;

		return (
			<Widget
				buildData={buildData[id]}
				data={widget}
				data-grid={layout}
				isEditable={editable}
				isNew={isNew}
				isSelected={selectedWidget === widget.id}
				key={id}
				onDrillDown={drillDown}
				onEdit={this.handleWidgetSelect}
				onRemove={this.showRemovalModal}
				ref={ref}
			/>
		);
	};

	render () {
		return (
			<div className={styles.content}>
				{this.renderGridWithContainer()}
				{this.renderRightPanel()}
			</div>
		);
	}
}

export default DashboardContent;
