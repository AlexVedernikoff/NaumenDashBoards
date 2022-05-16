// @flow
import type {Column, Row as RowType} from 'Table/types';
import {COLUMN_TYPES} from 'store/widgets/buildData/constants';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'components/types';
import {SCROLL_BORDERS_WIDTH} from './constants';
import styles from './styles.less';

export class Body extends PureComponent<Props, State> {
	bodyRef: Ref<'div'> = createRef();

	componentDidMount () {
		const {onChangeScrollBarWidth} = this.props;
		const {current: body} = this.bodyRef;

		if (body) {
			const {clientWidth, offsetWidth} = body;
			const scrollBarWidth = offsetWidth - clientWidth + SCROLL_BORDERS_WIDTH;

			onChangeScrollBarWidth(scrollBarWidth);
		}
	}

	renderCell = (row: RowType, rowIndex: number) => (column: Column, columnIndex: number, columns: Array<Column>) => {
		const {columnsWidth, components, fixedPositions, onClickCell, rowsInfo, settings} = this.props;
		const {defaultValue, textAlign, textHandler} = settings.body;
		const {accessor} = column;
		const {BodyCell} = components;
		const width = columnsWidth[accessor];
		const last = columnIndex === columns.length - 1;
		const left = fixedPositions[accessor];
		const key = `${accessor}-${rowIndex}`;
		let value = row[accessor];

		if (column.type !== COLUMN_TYPES.PARAMETER && (Number(value) === 0)) {
			value = '';
		}

		return (
			<BodyCell
				className={styles.cell}
				column={column}
				components={components}
				defaultValue={defaultValue.value}
				key={key}
				last={last}
				left={left}
				onClick={onClickCell}
				row={row}
				rowIndex={rowIndex}
				rowsInfo={rowsInfo}
				textAlign={textAlign}
				textHandler={textHandler}
				value={value}
				width={width}
			/>
		);
	};

	renderRow = (row: RowType, index: number) => {
		const {columns, components, width} = this.props;
		const {Row} = components;

		return <Row key={index} width={width}>{columns.map(this.renderCell(row, index))}</Row>;
	};

	render () {
		const {data, onScroll} = this.props;

		return (
			<div className={styles.body} onScroll={onScroll} ref={this.bodyRef}>
				{data.map(this.renderRow)}
			</div>
		);
	}
}

export default Body;
