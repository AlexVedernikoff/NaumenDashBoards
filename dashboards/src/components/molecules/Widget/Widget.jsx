// @flow
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {CARD_OBJECT_VALUE_SEPARATOR, META_CLASS_VALUE_SEPARATOR} from 'store/widgets/buildData/constants';
import cn from 'classnames';
import {COLUMN_TYPES} from 'components/organisms/TableWidget/constants';
import {ControlPanel} from './components';
import {createContextName, createSnapshot, exportSheet, FILE_VARIANTS} from 'utils/export';
import {deepClone} from 'src/helpers';
import {Diagram} from 'components/molecules';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {DivRef} from 'components/types';
import {getSeparatedLabel, isCardObjectColumn} from 'components/organisms/TableWidget/helpers';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import styles from './styles.less';
import {TextWidget} from 'components/organisms';
import type {TextWidget as TextWidgetType, Widget as WidgetType} from 'store/widgets/data/types';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export class Widget extends PureComponent<Props, State> {
	static defaultProps = {
		className: ''
	};

	state = {
		hasError: false
	};

	ref: DivRef = createRef();

	static getDerivedStateFromError (error: Object) {
		window.top.console.log(error);

		return {
			hasError: true
		};
	}

	componentDidMount () {
		this.focus();
	}

	componentDidUpdate (prevProps: Props) {
		const {buildData, focused} = this.props;

		if (prevProps.buildData) {
			const {buildData: {loading: nextLoading, updateDate: nextUpdateDate}} = prevProps;
			const {loading: prevLoading, updateDate: prevUpdateDate} = buildData;

			if (nextLoading !== prevLoading || nextUpdateDate !== prevUpdateDate) {
				this.setState({hasError: false});
			}
		}

		if (focused && focused !== prevProps.focused) {
			this.focus();
		}
	}

	focus = () => {
		const {focused, onFocus} = this.props;
		const {current: widget} = this.ref;

		focused && widget && onFocus(widget);
	};

	getClassName = () => {
		const {className, isSelected} = this.props;

		return cn({
			[styles.widget]: true,
			[styles.selectedWidget]: isSelected,
			[className]: true
		});
	};

	handleClick = (e: SyntheticMouseEvent<HTMLDivElement>) => {
		const {data, onClick} = this.props;
		onClick(e, data);
	};

	handleEdit = () => {
		const {data, onEdit} = this.props;
		onEdit(data.id, this.ref);
	};

	handleExport = async (type: string) => {
		const {buildData, data: widget} = this.props;
		const {data} = buildData;
		const {current} = this.ref;
		const contextName = await createContextName();
		const name = `${widget.name}_${contextName}`;

		if (data) {
			if (type === FILE_VARIANTS.XLSX) {
				return exportSheet(name, {...data, data: this.removeCodesFromRows(data)});
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
		}
	};

	removeCodesFromRows = (data: DiagramBuildData) => {
		const {columns, data: originalRows} = data;
		const rows = deepClone(originalRows);

		columns.forEach(column => {
			const {accessor, attribute, type} = column;

			if (type === COLUMN_TYPES.PARAMETER && attribute.type === ATTRIBUTE_TYPES.metaClass) {
				rows.forEach(row => {
					const value = row[accessor];
					row[accessor] = typeof value === 'string' ? getSeparatedLabel(value, META_CLASS_VALUE_SEPARATOR) : value;
				});
			}

			if (isCardObjectColumn(column)) {
				rows.forEach(row => {
					const value = row[accessor];
					row[accessor] = typeof value === 'string' ? getSeparatedLabel(value, CARD_OBJECT_VALUE_SEPARATOR) : value;
				});
			}
		});

		return rows;
	};

	renderContent = () => {
		const {data, isNew} = this.props;
		const {hasError} = this.state;

		if (!isNew && !hasError) {
			const {
				BAR,
				BAR_STACKED,
				COLUMN,
				COLUMN_STACKED,
				COMBO,
				DONUT,
				LINE,
				PIE,
				SPEEDOMETER,
				SUMMARY,
				TABLE,
				TEXT
			} = WIDGET_TYPES;

			switch (data.type) {
				case BAR:
				case BAR_STACKED:
				case COLUMN:
				case COLUMN_STACKED:
				case COMBO:
				case DONUT:
				case LINE:
				case PIE:
				case SPEEDOMETER:
				case SUMMARY:
				case TABLE:
					return this.renderDiagram(data);
				case TEXT:
					return this.renderTextWidget(data);
				default:
					return null;
			}
		}
	};

	renderControlPanel = () => {
		const {
			data: widget,
			editWidgetChunkData,
			isEditable,
			isNew,
			onDrillDown,
			onOpenNavigationLink,
			onRemove
		} = this.props;

		if (!isNew) {
			return (
				<ControlPanel
					className={styles.controlPanel}
					editWidgetChunkData={editWidgetChunkData}
					isEditable={isEditable}
					onDrillDown={onDrillDown}
					onEdit={this.handleEdit}
					onExport={this.handleExport}
					onOpenNavigationLink={onOpenNavigationLink}
					onRemove={onRemove}
					widget={widget}
				/>
			);
		}

		return null;
	};

	renderDiagram = (widget: WidgetType) => {
		const {buildData, fetchBuildData, isNew, onDrillDown, onOpenCardObject, onUpdate} = this.props;
		const {hasError} = this.state;

		if (!isNew && !hasError) {
			return (
				<Diagram
					buildData={buildData}
					fetchBuildData={fetchBuildData}
					onDrillDown={onDrillDown}
					onOpenCardObject={onOpenCardObject}
					onUpdate={onUpdate}
					widget={widget}
				/>
			);
		}
	};

	renderError = () => {
		const {hasError} = this.state;
		const message = 'Ошибка построения.';

		return hasError && <div className={styles.error} title={message}>{message}</div>;
	};

	renderTextWidget = (widget: TextWidgetType) => <TextWidget widget={widget} />;

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
				{this.renderControlPanel()}
				{this.renderContent()}
				{this.renderError()}
				{children}
			</div>
		);
	}
}

export default Widget;
