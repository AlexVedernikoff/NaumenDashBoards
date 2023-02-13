// @flow
import Body from 'PivotWidget/components/Body';
import cn from 'classnames';
import type {DivRef} from 'components/types';
import Headers from 'PivotWidget/components/Headers';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import ResizeDetector from 'components/molecules/ResizeDetector';
import styles from './styles.less';
import t from 'localization';

export class PivotWidget extends PureComponent<Props, State> {
	static defaultProps = {
		className: ''
	};

	containerRef: DivRef = createRef();

	constructor (props: Props) {
		super();
		this.state = {
			columnsWidth: props.options?.columnsWidth ?? [],
			options: props.options ?? {}
		};
	}

	static getDerivedStateFromProps (props: Props, state: State) {
		const {options} = props;

		if (options.type === 'PivotOptions') {
			return {options};
		}

		return null;
	}

	componentDidUpdate (prevProps: Props) {
		const {options} = this.props;

		if (prevProps.options !== options && options.type === 'PivotOptions') {
			const {columnsWidth: prevColumnsWidth} = prevProps.options;
			const {columnsWidth} = options;

			if (
				!prevColumnsWidth
				|| prevColumnsWidth.length !== columnsWidth.length
				|| prevColumnsWidth.some((width, idx) => width !== columnsWidth[idx])
			) {
				this.setState({columnsWidth});
			}
		}
	}

	handleChangeColumnsWidth = (columnsWidth: Array<number>) => this.setState({columnsWidth});

	handleClearEvent = e => e.stopPropagation();

	handleDrillDown = (indicator: string, filters: Array<{key: string, value: string}>, breakdown?: string) => {
		const {drillDown, setWidgetWarning, widget} = this.props;
		const {options: {getDrillDownOptions}} = this.state;
		const params = getDrillDownOptions(indicator, filters, breakdown);

		if (params.mode === 'error') {
			setWidgetWarning({id: widget.id, message: t('drillDownBySelection::Fail')});
		} else if (params.mode === 'success') {
			drillDown(widget, params.index, params.mixin);
		}
	};

	handleResize = (...props) => {
		const {updateOptions} = this.props;
		const {current: container} = this.containerRef;

		if (container) {
			updateOptions(container);
		}
	};

	renderBody = () => {
		const {columnsWidth, options: {bodyStyle, columnsList, data, formatters, showTotal}} = this.state;

		return (
			<Body
				columns={columnsList}
				columnsWidth={columnsWidth}
				data={data}
				drillDown={this.handleDrillDown}
				formatters={formatters}
				showTotal={showTotal}
				style={bodyStyle}
			/>
		);
	};

	renderHeaders = () => {
		const {columnsWidth, options: {formatters, headHeight, headerStyle, headers}} = this.state;

		return (
			<Headers
				columnsWidth={columnsWidth}
				formatters={formatters}
				headHeight={headHeight}
				headers={headers}
				onChangeColumnsWidth={this.handleChangeColumnsWidth}
				style={headerStyle}
			/>
		);
	};

	render () {
		const {className} = this.props;

		return (
			<ResizeDetector onResize={this.handleResize}>
				<div className={cn(styles.container, className)} onClick={this.handleClearEvent} ref={this.containerRef}>
					{this.renderHeaders()}
					{this.renderBody()}
				</div>
			</ResizeDetector>
		);
	}
}

export default PivotWidget;
