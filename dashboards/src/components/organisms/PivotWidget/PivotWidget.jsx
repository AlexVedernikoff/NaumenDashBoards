// @flow
import Body from 'PivotWidget/components/Body';
import cn from 'classnames';
import type {DivRef} from 'components/types';
import Headers from 'PivotWidget/components/Headers';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import ResizeDetector from 'components/molecules/ResizeDetector';
import styles from './styles.less';

export class PivotWidget extends PureComponent<Props, State> {
	static defaultProps = {
		className: ''
	};

	containerRef: DivRef = createRef();

	state: State = {
		columnsWidth: [],
		options: {}
	};

	static getDerivedStateFromProps (props: Props, state: State) {
		const {options} = props;

		if (options.type === 'PivotOptions') {
			return {options};
		}

		return null;
	}

	componentDidUpdate (prevProps: Props) {
		const {options} = this.props;
		const {columnsWidth} = this.state;

		if (prevProps.options !== options && options.type === 'PivotOptions') {
			const {columnWidth: prevColumnWidth} = prevProps.options;
			const {columnWidth, columnsList} = options;

			if (columnsList.length !== columnsWidth.length || prevColumnWidth !== columnWidth) {
				const columnsWidth = Array.from({length: columnsList.length}).map((_, i) => i === 0 ? columnWidth * 2 : columnWidth);

				this.setState({columnsWidth});
			}
		}
	}

	handleChangeColumnsWidth = (columnsWidth: Array<number>) => this.setState({columnsWidth});

	handleResize = (...props) => {
		const {updateOptions} = this.props;
		const {current: container} = this.containerRef;

		if (container) {
			updateOptions(container);
		}
	};

	renderBody = () => {
		const {columnsWidth, options: {bodyStyle, columnsList, data, formatters}} = this.state;

		return (
			<Body
				columns={columnsList}
				columnsWidth={columnsWidth}
				data={data}
				formatters={formatters}
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
	};;

	render () {
		const {className} = this.props;

		return (
			<ResizeDetector onResize={this.handleResize}>
				<div className={cn(styles.container, className)} ref={this.containerRef}>
					{this.renderHeaders()}
					{this.renderBody()}
				</div>
			</ResizeDetector>
		);
	}
}

export default PivotWidget;
