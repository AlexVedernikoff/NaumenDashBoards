// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import {notify} from 'helpers/notify';
import type {Option} from 'types/option';
import PanelPointContent from 'components/atoms/PanelPointContent';
import PanelPointHeader from 'components/atoms/PanelPointHeader';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './PanelPoint.less';

export class PanelPoint extends Component<Props, State> {
	showSingle = () => {
		const {showSingleObject} = this.props;

		if (!showSingleObject) {
			const {geoposition, pointData, setSingleObject, type} = this.props;

			if (!geoposition) {
				const {header} = pointData;
				notify('single', 'info', header);
			}

			const data = {
				data: pointData,
				geoposition,
				type
			};

			setSingleObject(data);
		}
	};

	renderHeader = () => {
		const {pointData: {header = 'Название отсутствует'}} = this.props;

		return (
			<div onClick={this.showSingle}>
				<PanelPointHeader header={header} />
			</div>
		);
	};

	renderOptions = () => {
		const {pointData: {options = []}} = this.props;

		return options.map((option: Option, id: number) => <PanelPointContent key={id} option={option} />);
	};

	render () {
		return (
			<div className={styles.pointContainer}>
				{this.renderHeader()}
				{this.renderOptions()}
			</div>
		);
	}
}

export default connect(props, functions)(PanelPoint);
