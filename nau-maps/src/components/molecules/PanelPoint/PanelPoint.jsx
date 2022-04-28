// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import type {Option} from 'types/option';
import PanelPointContent from 'components/molecules/PanelPointContent';
import PanelPointHeader from 'components/molecules/PanelPointHeader';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './PanelPoint.less';

export class PanelPoint extends Component<Props, State> {
	renderHeader = () => {
		const {point} = this.props;

		return <PanelPointHeader point={point} />;
	};

	renderOptions = () => {
		const {point: {data: {options = []}}} = this.props;
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
