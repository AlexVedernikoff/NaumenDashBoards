// @flow
import {Button, IconButton} from 'components/atoms';
import {CHART_VARIANTS} from 'utils/chart';
import cn from 'classnames';
import {CloseIcon, EditIcon, UnionIcon} from 'icons/form';
import {createOrderName, NewWidget} from 'utils/widget';
import {Diagram, Modal} from 'components/molecules';
import {editContentRef} from 'components/pages/DashboardEditContent';
import type {Element} from 'react';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {GRID_PARAMS} from 'utils/layout';
import type {Props, State} from './types';
import React, {Component, createRef, Fragment} from 'react';
import {Responsive as Grid} from 'react-grid-layout';
import styles from './styles.less';
import type {Widget} from 'store/widgets/data/types';

const props = {
	autoSize: undefined,
	breakpoint: undefined,
	className: undefined,
	draggableCancel: undefined,
	draggableHandle: undefined,
	isDraggable: undefined,
	isResizable: undefined,
	layout: undefined,
	margin: undefined,
	maxRows: undefined,
	onDrag: undefined,
	onDragStart: undefined,
	onDragStop: undefined,
	onResize: undefined,
	onResizeStart: undefined,
	onResizeStop: undefined,
	preventCollision: undefined,
	style: undefined,
	useCSSTransforms: undefined,
	verticalCompact: undefined
};

export const gridRef = createRef();
const newWidgetRef = createRef();

export class LayoutGrid extends Component<Props, State> {
	static defaultProps = {
		editable: false,
		role: null,
		selectedWidget: ''
	};

	state = {
		newWidgetExists: false,
		showModal: false,
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
			const {current: newWidget} = newWidgetRef;
			const {current: grid} = gridRef;
			const {current: content} = editContentRef;
			const {newWidgetExists} = this.state;

			if (newWidget && grid && !newWidgetExists) {
				this.setState(() => ({newWidgetExists: true}));
				content && content.scrollTo(0, grid.clientHeight);
			} else if (!newWidget && newWidgetExists) {
				this.setState(() => ({newWidgetExists: false}));
			}
		}
	}

	componentWillUnmount () {
		window.removeEventListener('resize', this.reloadGrid);
	}

	hideModal = () => this.setState({showModal: false, widgetIdToRemove: ''});

	reloadGrid = () => {
		const {current} = gridRef;

		if (current) {
			const width: number = current.clientWidth;
			this.setState({width});
		}
	};

	handleClickEdit = (id: string) => (): void => {
		const {onSelectWidget} = this.props;
		onSelectWidget(id);
	};

	handleClickDrillDown = (id: string) => () => {
		const {drillDown, widgets} = this.props;
		drillDown(widgets[id]);
	};

	handleClickComboDrillDown = (id: string, orderNum: number) => () => {
		const {comboDrillDown, widgets} = this.props;
		comboDrillDown(widgets[id], orderNum);
	};

	removeWidget = (onlyPersonal: boolean) => () => {
		const {onRemoveWidget} = this.props;
		const {widgetIdToRemove} = this.state;

		this.hideModal();
		onRemoveWidget(widgetIdToRemove, onlyPersonal);
	};

	showModal = (widgetIdToRemove: string) => () => this.setState({showModal: true, widgetIdToRemove});

	renderButtons = (widget: Widget) => (
		<div className={styles.widgetActions}>
			{this.renderEditButton(widget.id)}
			{this.renderDrillDownButtonByType(widget)}
			{this.renderRemoveButton(widget.id)}
		</div>
	);

	renderDrillDownButton = (id: string) => (
		<IconButton tip="Перейти" onClick={this.handleClickDrillDown(id)}>
			<UnionIcon />
		</IconButton>
	);

	renderDrillDownButtonByType = (widget: Widget) => {
		if (widget.type === CHART_VARIANTS.COMBO) {
			return this.renderDrillDownButtons(widget);
		}

		return this.renderDrillDownButton(widget.id);
	};

	renderDrillDownButtons = (widget: Widget) => {
		const {id, order} = widget;

		if (Array.isArray(order)) {
			return order.map(num => {
				const dataKey = widget[createOrderName(num)(FIELDS.dataKey)];
				const source = widget[createOrderName(num)(FIELDS.source)];
				let tipText = 'Перейти';

				if (source) {
					tipText = `${tipText} (${source.label})`;
				}

				return (
					<IconButton key={dataKey} tip={tipText} onClick={this.handleClickComboDrillDown(id, num)}>
						<UnionIcon />
					</IconButton>
				);
			});
		}
	};

	renderEditButton = (id: string) => {
		const {editable} = this.props;

		if (editable) {
			return (
				<IconButton tip="Редактировать" onClick={this.handleClickEdit(id)}>
					<EditIcon />
				</IconButton>
			);
		}
	};

	renderGrid = () => {
		const {onLayoutChange} = this.props;
		const {width} = this.state;

		if (width) {
			return (
				<Grid
					breakpoints={GRID_PARAMS.BREAK_POINTS}
					className={styles.grid}
					cols={GRID_PARAMS.COLS}
					compactType={null}
					containerPadding={GRID_PARAMS.CONTAINER_PADDING}
					onLayoutChange={onLayoutChange}
					rowHeight={GRID_PARAMS.ROW_HEIGHT}
					width={width}
					{...props}
				>
					{this.renderWidgets()}
				</Grid>
			);
		}
	};

	renderDefaultModal = () => {
		const {role} = this.props;
		const {showModal} = this.state;
		const onlyPersonal = role === null;

		if (showModal) {
			return (
				<Modal
					cancelText="Нет"
					header="Вы точно хотите удалить виджет?"
					onClose={this.hideModal}
					onSubmit={this.removeWidget(onlyPersonal)}
					size="small"
					submitText="Да"
				/>
			);
		}
	};

	renderMasterModal = () => {
		const {showModal} = this.state;

		if (showModal) {
			return <Modal header="Вы точно хотите удалить виджет?" renderFooter={this.renderModalFooter} />;
		}
	};

	renderModal = () => this.props.role === 'master' ? this.renderMasterModal() : this.renderDefaultModal();

	renderModalFooter = () => (
		<Fragment>
			<Button className={styles.modalButton} onClick={this.removeWidget(false)}>Да, все виджеты</Button>
			<Button className={styles.modalButton} onClick={this.removeWidget(true)}>Да, только персональный виджет</Button>
			<Button outline onClick={this.hideModal}>Нет</Button>
		</Fragment>
	);

	renderRemoveButton = (id: string) => {
		const {editable} = this.props;

		if (editable) {
			return (
				<Fragment>
					<IconButton tip="Удалить" onClick={this.showModal(id)}>
						<CloseIcon />
					</IconButton>
					{this.renderModal()}
				</Fragment>
			);
		}
	};

	renderWidget = (widget: Widget) => {
		const {selectedWidget} = this.props;
		const {id, layout} = widget;
		const ref = id === NewWidget.id ? newWidgetRef : null;
		const CNWidget = id === selectedWidget ? cn([styles.widget, styles.selectedWidget]) : styles.widget;

		return (
			<div key={id} data-grid={layout} className={CNWidget} ref={ref}>
				{this.renderWidgetByType(widget)}
			</div>
		);
	};

	renderWidgetByType = (widget: Widget) => {
		const {diagrams} = this.props;

		if (!(widget instanceof NewWidget)) {
			return (
				<Fragment>
					<Diagram widget={widget} diagram={diagrams[widget.id]} />
					{this.renderButtons(widget)}
				</Fragment>
			);
		}
	};

	renderWidgets = (): Array<Element<'div'>> => {
		const {widgets} = this.props;
		// $FlowFixMe
		return Object.values(widgets).map(this.renderWidget);
	};

	render () {
		return (
			<div ref={gridRef}>
				{this.renderGrid()}
			</div>
		);
	}
}

export default LayoutGrid;
