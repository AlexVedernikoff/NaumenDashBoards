// @flow
import type {Column} from 'Table/types';
import {COLUMN_TYPES} from 'store/widgets/buildData/constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import T from 'components/atoms/Translation';

export class Total extends PureComponent<Props> {
	renderColumn = (lastParameterIdx: number) => (column: Column, index: number, columns: Array<Column>) => {
		const {columnsWidth, components, countTotals, fixedPositions, scrollBarWidth} = this.props;
		const {TotalCell} = components;
		const totalComponents = {...components, Value: this.renderTotalValue};
		const {accessor} = column;
		const left = fixedPositions[accessor];
		const last = index === columns.length - 1;
		const width = columnsWidth[accessor] + (last ? scrollBarWidth : 0);
		let value = '';

		if (index === lastParameterIdx) {
			value = countTotals.toString();
		}

		return (
			<TotalCell
				column={column}
				components={totalComponents}
				key={accessor}
				last={last}
				left={left}
				value={value}
				width={width}
			/>
		);
	};

	renderTotalValue = ({value}) => {
		if (value && value.toString().trim() !== '') {
			return (
				<div className={styles.totalValue}>
					<div><T text='Table::Total::Total' /></div>
					<div>{value}</div>
				</div>
			);
		}

		return null;
	};

	render () {
		const {columns, components, forwardedRef, width} = this.props;
		const {Row} = components;
		const columnTypes = columns.map(({type}) => type);
		let lastParameterId = columnTypes.lastIndexOf(COLUMN_TYPES.PARAMETER);

		if (lastParameterId === -1) {
			const indicatorTypes = [COLUMN_TYPES.BREAKDOWN, COLUMN_TYPES.INDICATOR];

			lastParameterId = columnTypes.findIndex(type => indicatorTypes.includes(type)) - 1;

			if (lastParameterId === -1) {
				lastParameterId = 0;
			}
		}

		const renderColumn = this.renderColumn(lastParameterId);

		return (
			<div className={styles.total} ref={forwardedRef}>
				<Row width={width}>{columns.map(renderColumn)}</Row>
			</div>
		);
	}
}

export default Total;
