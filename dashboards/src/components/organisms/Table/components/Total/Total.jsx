// @flow
import type {Column} from 'Table/types';
import {COLUMN_TYPES} from 'store/widgets/buildData/constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import t from 'localization';

export class Total extends PureComponent<Props> {
	renderColumn = (lastParameterIdx: number) => (column: Column, index: number, columns: Array<Column>) => {
		const {columnsWidth, components, countTotals, fixedPositions, scrollBarWidth} = this.props;
		const {TotalCell} = components;
		const {accessor} = column;
		const left = fixedPositions[accessor];
		const last = index === columns.length - 1;
		const width = columnsWidth[accessor] + (last ? scrollBarWidth : 0);
		let value = '';

		if (index === lastParameterIdx) {
			value = t('Table::Total::Total');
		} else if (index === lastParameterIdx + 1) {
			value = countTotals.toString();
		}

		return (
			<TotalCell
				column={column}
				components={components}
				key={accessor}
				last={last}
				left={left}
				value={value}
				width={width}
			/>
		);
	};

	render () {
		const {columns, components, forwardedRef, width} = this.props;
		const {Row} = components;
		const lastParameterId = columns.map(({type}) => type).lastIndexOf(COLUMN_TYPES.PARAMETER);
		const renderColumn = this.renderColumn(lastParameterId);

		return (
			<div className={styles.total} ref={forwardedRef}>
				<Row width={width}>{columns.map(renderColumn)}</Row>
			</div>
		);
	}
}

export default Total;
