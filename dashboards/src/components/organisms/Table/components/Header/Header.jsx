// @flow
import type {Column} from 'Table/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {SORTING_TYPES} from 'store/widgets/data/constants';
import styles from './styles.less';
import {sumColumnsWidth} from 'Table/helpers';

export class Header extends PureComponent<Props> {
	handleClick = (column: Column) => {
		const {onChangeSorting, sorting} = this.props;
		const {ASC, DESC} = SORTING_TYPES;
		const {accessor, columns} = column;

		if (!columns) {
			let type = ASC;

			if (sorting.accessor === accessor && sorting.type === ASC) {
				type = DESC;
			}

			onChangeSorting && onChangeSorting({accessor, type});
		}
	};

	renderColumn = (column: Column, index: number) => {
		const {columnSettings, columnsWidth, components, onChangeColumnWidth, sorting} = this.props;
		const {HeaderCell} = components;
		const {fontColor, fontStyle, textAlign, textHandler} = columnSettings;
		const {accessor, columns, header} = column;
		const width = Array.isArray(columns) ? sumColumnsWidth(columnsWidth, columns) : columnsWidth[accessor];
		let sortingType;

		if (sorting.accessor === accessor) {
			sortingType = sorting.type;
		}

		return (
			<div className={styles.cellContainer} style={{width}}>
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
					textAlign={textAlign}
					textHandler={textHandler}
					value={header}
					width={width}
				/>
				{this.renderSubColumns(columns)}
			</div>
		);
	};

	renderSubColumns = (columns?: Array<Column>): React$Node => {
		if (Array.isArray(columns) && columns.length > 0) {
			return (
				<div className={styles.subColumnsContainer}>
					{columns.map(this.renderColumn)}
				</div>
			);
		}

		return null;
	};

	render () {
		const {columns, width} = this.props;

		return (
			<div className={styles.header} style={{width}}>
				{columns.map(this.renderColumn)}
			</div>
		);
	}
}

export default Header;
