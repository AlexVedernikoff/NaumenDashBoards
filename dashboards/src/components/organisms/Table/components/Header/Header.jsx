// @flow
import type {Column} from 'Table/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {SORTING_TYPES} from 'store/widgets/data/constants';
import styles from './styles.less';

export class Header extends PureComponent<Props> {
	handleClick = (columnIndex: number) => {
		const {onChangeSorting, sorting} = this.props;
		const {ASC, DESC} = SORTING_TYPES;
		let type = ASC;

		if (sorting.column === columnIndex && sorting.type === ASC) {
			type = DESC;
		}

		onChangeSorting({column: columnIndex, type});
	};

	renderColumn = (column: Column, index: number) => {
		const {columnSettings, columnsWidth, components, onChangeColumnWidth, sorting} = this.props;
		const {HeaderCell} = components;
		const {fontColor, fontStyle} = columnSettings;
		const {accessor, header} = column;
		let sortingType;

		if (sorting && sorting.column === index) {
			sortingType = sorting.type;
		}

		return (
			<HeaderCell
				column={column}
				columnIndex={index}
				components={components}
				fontColor={fontColor}
				fontStyle={fontStyle}
				key={accessor}
				onChangeWidth={onChangeColumnWidth}
				onClick={this.handleClick}
				sorting={sortingType}
				value={header}
				width={columnsWidth[index]}
			/>
		);
	};

	render () {
		const {columns, components, width} = this.props;
		const {Row} = components;

		return (
			<thead className={styles.header} style={{minWidth: width}}>
				<Row>
					{columns.map(this.renderColumn)}
				</Row>
			</thead>
		);
	}
}

export default Header;
