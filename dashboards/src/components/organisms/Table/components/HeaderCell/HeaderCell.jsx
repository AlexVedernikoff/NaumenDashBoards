// @flow
import cn from 'classnames';
import {MIN_WIDTH} from './constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {SORTING_TYPES} from 'store/widgets/data/constants';
import styles from './styles.less';

export class HeaderCell extends PureComponent<Props> {
	dragStart = false;
	resizerOffset: number;
	cursorStart: number;

	componentDidMount () {
		document.addEventListener('mousemove', this.mouseMove);
		document.addEventListener('mouseup', this.mouseUp);
	}

	componentWillUnmount () {
		document.removeEventListener('mousemove', this.mouseMove);
		document.removeEventListener('mouseup', this.mouseUp);
	}

	handleMouseDownCell = () => {
		const {column, onClick} = this.props;

		!this.dragStart && onClick && onClick(column);
	};

	mouseDown = (event: MouseEvent) => {
		const {width} = this.props;

		this.cursorStart = event.pageX;
		this.resizerOffset = width;
		this.dragStart = true;

		event.stopPropagation();
	};

	mouseMove = (event: MouseEvent) => {
		if (this.dragStart) {
			const {column, onChangeWidth} = this.props;
			const newWidth = Math.floor(Math.max(this.resizerOffset + event.pageX - this.cursorStart, MIN_WIDTH));

			onChangeWidth(newWidth, column);
		}
	};

	mouseUp = () => {
		this.dragStart = false;
	};

	renderResizer = () => <div className={styles.resizer} onMouseDown={this.mouseDown} />;

	render () {
		const {column, components, fontColor, fontStyle, last, left, sorting, textAlign, textHandler, value, width} = this.props;
		const {ASC, DESC} = SORTING_TYPES;
		const {Cell} = components;
		const fixed = !isNaN(parseFloat(left));
		const cellCN = cn({
			[styles.cellContainer]: true,
			[styles.fixedCellContainer]: fixed,
			[styles.sortAsc]: sorting === ASC,
			[styles.sortDesc]: sorting === DESC
		});

		return (
			<div className={cellCN} onMouseDown={this.handleMouseDownCell} style={{left}}>
				<Cell
					column={column}
					components={components}
					fontColor={fontColor}
					fontStyle={fontStyle}
					last={last}
					textAlign={textAlign}
					textHandler={textHandler}
					tip={value}
					value={value}
					width={width}
				/>
				{this.renderResizer()}
			</div>
		);
	}
}

export default HeaderCell;
