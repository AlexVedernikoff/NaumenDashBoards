// @flow
import type {Column} from 'Table/types';
import {HeaderCell, Row} from 'Table/components';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {SORTING_TYPES} from 'store/widgets/data/constants';
import styles from './styles.less';

export class Header extends PureComponent<Props> {
	handleClick = (column: number) => {
		const {onChangeSorting, sorting} = this.props;
		const {ASC, DESC} = SORTING_TYPES;
		let type = ASC;

		if (sorting.column === column && sorting.type === ASC) {
			type = DESC;
		}

		onChangeSorting({column, type});
	};

	renderColumn = (column: Column, index: number) => {
		const {columnSettings, columnsWidth, onChangeColumnWidth, onFinishedChangeColumnWidth, sorting} = this.props;
		const {fontColor, fontStyle} = columnSettings;
		const {accessor, header} = column;
		let sortingType;

		if (sorting && sorting.column === index) {
			sortingType = sorting.type;
		}

		return (
			<HeaderCell
				fontColor={fontColor}
				fontStyle={fontStyle}
				index={index}
				key={accessor}
				onChangeWidth={onChangeColumnWidth}
				onClick={this.handleClick}
				onFinishedChangeWidth={onFinishedChangeColumnWidth}
				sorting={sortingType}
				value={header}
				width={columnsWidth[index]}
			/>
		);
	};

	render () {
		const {columns, width} = this.props;

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
