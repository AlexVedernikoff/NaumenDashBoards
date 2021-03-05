// @flow
import Chart from 'containers/Chart';
import cn from 'classnames';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {DivRef} from 'components/types';
import {FONT_STYLES, HEADER_POSITIONS, TEXT_HANDLERS, WIDGET_TYPES} from 'store/widgets/data/constants';
import {PADDING} from './constants';
import type {Props, State} from './types';
import React, {Component, createRef} from 'react';
import settingsStyles from 'styles/settings.less';
import SpeedometerWidget from 'components/organisms/SpeedometerWidget';
import styles from './styles.less';
import SummaryWidget from 'components/organisms/SummaryWidget';
import TableWidget from 'components/organisms/TableWidget';
import type {TableWidget as TableWidgetType} from 'store/widgets/data/types';

export class Diagram extends Component<Props, State> {
	static defaultProps = {
		buildData: {
			data: null,
			error: false,
			loading: false
		}
	};

	ref: DivRef = createRef();
	nameRef: DivRef = createRef();

	state = {
		nameRendered: false
	};

	componentDidMount () {
		if (this.nameRef.current) {
			this.setState({nameRendered: true});
		}

		this.getBuildData();
	}

	componentDidUpdate (prevProps: Props) {
		if (this.nameRef.current && this.isUpdated(prevProps, this.props)) {
			this.setState({nameRendered: true});
		}
	}

	getBuildData = () => {
		const {buildData, fetchBuildData, widget} = this.props;
		const {data, error, loading} = buildData;

		if (!(error || loading || data)) {
			fetchBuildData(widget);
		}
	};

	isUpdated = (prevProps: Props, nextProps: Props): boolean => {
		const {buildData: prevBuildData, widget: prevWidget} = prevProps;
		const {buildData, widget} = nextProps;

		return buildData?.data !== prevBuildData?.data || widget !== prevWidget;
	};

	resolveDiagram = (data: DiagramBuildData) => {
		const {onDrillDown, widget} = this.props;
		const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE, SPEEDOMETER, SUMMARY, TABLE} = WIDGET_TYPES;

		switch (widget.type) {
			case BAR:
			case BAR_STACKED:
			case COLUMN:
			case COLUMN_STACKED:
			case COMBO:
			case DONUT:
			case LINE:
			case PIE:
				return <Chart data={data} widget={widget} />;
			case SPEEDOMETER:
				return <SpeedometerWidget data={data} widget={widget} />;
			case SUMMARY:
				return <SummaryWidget data={data} onDrillDown={onDrillDown} widget={widget} />;
			case TABLE:
				return this.renderTableWidget(widget, data);
			default:
				return null;
		}
	};

	renderContent = () => {
		const {buildData, widget} = this.props;
		const {data, error, loading} = buildData;

		if (!(loading || error) && data) {
			const contentCN = cn({
				[styles.content]: true,
				[styles.reverseContent]: widget.header.position === HEADER_POSITIONS.BOTTOM
			});

			return (
				<div className={contentCN}>
					{this.renderName()}
					{this.renderDiagram(data)}
				</div>
			);
		}

		return null;
	};

	renderDiagram = (data: DiagramBuildData) => {
		const {show} = this.props.widget.header;
		const {nameRendered} = this.state;

		if (!show || nameRendered) {
			const {current: container} = this.ref;
			const {current: nameContainer} = this.nameRef;
			let height = '100%';

			if (show && container && nameContainer) {
				height = container.clientHeight - nameContainer.clientHeight - (PADDING * 2);
			}

			return (
				<div className={styles.diagramContainer} style={{height}}>
					{this.resolveDiagram(data)}
				</div>
			);
		}
	};

	renderError = () => {
		const {error} = this.props.buildData;
		const message = 'Ошибка загрузки данных. Измените параметры построения.';

		if (error) {
			return <div className={styles.error} title={message}>{message}</div>;
		}
	};

	renderLoading = () => {
		const {loading} = this.props.buildData;

		if (loading) {
			return <p>Загрузка...</p>;
		}
	};

	renderName = () => {
		const {header, name: widgetName} = this.props.widget;
		const {nameRendered} = this.state;
		const {fontColor, fontFamily, fontSize, fontStyle, name, show, textAlign, textHandler, useName} = header;

		if (show) {
			const {BOLD, ITALIC, UNDERLINE} = FONT_STYLES;
			const {CROP, WRAP} = TEXT_HANDLERS;
			const nameCN = cn({
				[styles.hideName]: !nameRendered,
				[settingsStyles.bold]: fontStyle === BOLD,
				[settingsStyles.italic]: fontStyle === ITALIC,
				[settingsStyles.underline]: fontStyle === UNDERLINE,
				[settingsStyles.crop]: textHandler === CROP,
				[settingsStyles.wrap]: textHandler === WRAP
			});
			let minHeight;

			if (this.nameRef.current) {
				minHeight = this.nameRef.current.clientHeight;
			}

			const style = {
				color: fontColor,
				fontFamily,
				fontSize: Number(fontSize),
				minHeight,
				textAlign
			};

			return (
				<div className={nameCN} ref={this.nameRef} style={style}>
					{useName ? widgetName : name}
				</div>
			);
		}

		return null;
	};

	renderTableWidget = (widget: TableWidgetType, data: DiagramBuildData) => {
		const {fetchBuildData, onDrillDown, onOpenCardObject, onUpdate} = this.props;

		return (
			<TableWidget
				data={data}
				onDrillDown={onDrillDown}
				onFetchBuildData={fetchBuildData}
				onOpenCardObject={onOpenCardObject}
				onUpdate={onUpdate}
				widget={widget}
			/>
		);
	};

	render () {
		return (
			<div className={styles.container} ref={this.ref} style={{padding: PADDING}}>
				{this.renderLoading()}
				{this.renderError()}
				{this.renderContent()}
			</div>
		);
	}
}

export default Diagram;
