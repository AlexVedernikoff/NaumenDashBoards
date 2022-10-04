// @flow
import type {PivotDataRow} from 'utils/recharts/types';
import PivotRow from 'PivotWidget/components/PivotRow/PivotRow';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Body extends PureComponent<Props> {
	renderTopRow = (row: PivotDataRow, idx: number) => {
		const {columns, columnsWidth, drillDown, formatters, style} = this.props;
		const key = `row_${row.key}::${row.value}`;
		const filter = [{key: row.key, value: row.value}];
		const index = `${idx + 1}.`;

		return (
			<PivotRow
				columns={columns}
				columnsWidth={columnsWidth}
				drillDown={drillDown}
				filter={filter}
				formatters={formatters}
				index={index}
				key={key}
				level={0}
				row={row}
				style={style}
			/>
		);
	};

	render () {
		const {columnsWidth, data} = this.props;

		if (data && columnsWidth && columnsWidth.length > 0) {
			const width = (columnsWidth?.reduce((sum, e) => sum + e, 0) ?? 0);
			const style = {width: `${width}px`};

			return (
				<div className={styles.body} style={style}>
					{data.map(this.renderTopRow)}
					<div className={styles.borderBottom}></div>
				</div>
			);
		}

		return null;
	}
}

export default Body;
