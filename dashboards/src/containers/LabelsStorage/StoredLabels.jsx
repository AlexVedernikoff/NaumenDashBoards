// @flow
import type {Context, Label} from './types';
import {generateLabelKey} from './helpers';
import {LABELS_STORAGE_CONTEXT} from './constants';
import React, {PureComponent} from 'react';

export class StoredLabels extends PureComponent<{}> {
	renderLabel = (label: Label, idx: number) => {
		const {content, dataKey, external, force, formatter, height, parentViewBox, textBreakAll, value, viewBox, width, ...props} = label;

		console.log('height = ', height);
		console.log('external = ', external);

		const dx = external ? width + 7 : width / 2;
		const textAnchor = external ? 'right' : 'middle';
		const dy = height / 2;
		const textValue = formatter ? formatter(value, label) : value;
		const key = generateLabelKey(label);

		return (
			<text {...props} dominantBaseline="middle" key={key} textAnchor={textAnchor} >
				<tspan dx={dx} dy={dy}> {textValue}</tspan >
			</text >
		);
	};

	renderLabels = (context: Context) => (
		<g style={{pointerEvents: 'none'}}>
			{context?.getLabels?.().map(this.renderLabel)}
		</g>
	);

	render () {
		return (
			<LABELS_STORAGE_CONTEXT.Consumer>
				{this.renderLabels}
			</LABELS_STORAGE_CONTEXT.Consumer>
		);
	}
}

export default StoredLabels;
