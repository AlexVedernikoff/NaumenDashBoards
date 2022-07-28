// @flow
import HeaderColumn from 'PivotWidget/components/HeaderColumn';
import type {PivotColumn} from 'utils/recharts/types';
import {PIVOT_COLUMN_MIN_WIDTH} from 'utils/recharts/constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Headers extends PureComponent<Props> {
	handleChangeWidth = (offset: number, newWidth: number) => {
		const {columnsWidth, onChangeColumnsWidth} = this.props;
		const newColumnsWidth = [...columnsWidth];

		newColumnsWidth[offset] = Math.max(newWidth, PIVOT_COLUMN_MIN_WIDTH);

		onChangeColumnsWidth(newColumnsWidth);
	};

	renderHeaderCells = (headers: Array<PivotColumn>) => {
		const {columnsWidth, formatters, style} = this.props;
		const result = [];
		let offset = 0;

		// eslint-disable-next-line no-unused-vars
		for (const column of headers) {
			result.push(
				<HeaderColumn
					column={column}
					columnsWidth={columnsWidth}
					formatter={formatters.indicator}
					key={column.key}
					offset={offset}
					onChangeWidth={this.handleChangeWidth}
					style={style}
				/>
			);

			offset += column.width;
		}

		return result;
	};

	render () {
		const {columnsWidth, headers} = this.props;
		const width = columnsWidth?.reduce((sum, e) => sum + e, 0) ?? 0;
		const style = {width: `${width}px`};

		if (headers && width > 0) {
			return (
				<div className={styles.headers} style={style}>
					{this.renderHeaderCells(headers)}
				</div>
			);
		}

		return null;
	}
}

export default Headers;
