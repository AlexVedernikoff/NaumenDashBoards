// @flow
import cn from 'classnames';
import {MIN_WIDTH} from './constants';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'components/types';
import {SORTING_TYPES, TEXT_ALIGNS} from 'store/widgets/data/constants';
import styles from './styles.less';

export class HeaderCell extends PureComponent<Props> {
	ref: Ref<'div'> = createRef();
	dragStart = false;
	resizerOffset: number;
	cursorStart: number;

	componentDidMount () {
		const {current: resizer} = this.ref;

		if (resizer) {
			document.addEventListener('mousemove', this.mouseMove);
			document.addEventListener('mouseup', this.mouseUp);
			resizer.addEventListener('mousedown', this.mouseDown);
		}
	}

	componentWillUnmount () {
		const {current: resizer} = this.ref;

		if (resizer) {
			document.removeEventListener('mousemove', this.mouseMove);
			document.removeEventListener('mouseup', this.mouseUp);
			resizer.removeEventListener('mousedown', this.mouseDown);
		}
	}

	handleClick = () => {
		const {column, onClick} = this.props;
		onClick(column);
	};

	handleClickResizer = (event: SyntheticMouseEvent<HTMLDivElement>) => event.stopPropagation();

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

	renderResizer = () => <div className={styles.resizer} onClick={this.handleClickResizer} ref={this.ref} />;

	render () {
		const {column, components, fontColor, fontStyle, sorting, value} = this.props;
		const {ASC, DESC} = SORTING_TYPES;
		const {Cell} = components;
		const cellCN = cn({
			[styles.cellContainer]: true,
			[styles.sortAsc]: sorting === ASC,
			[styles.sortDesc]: sorting === DESC
		});

		return (
			<div className={cellCN} onClick={this.handleClick}>
				<Cell
					className={styles.cell}
					column={column}
					components={components}
					fontColor={fontColor}
					fontStyle={fontStyle}
					textAlign={TEXT_ALIGNS.center}
					tip={value}
					value={value}
				/>
				{this.renderResizer()}
			</div>
		);
	}
}

export default HeaderCell;
