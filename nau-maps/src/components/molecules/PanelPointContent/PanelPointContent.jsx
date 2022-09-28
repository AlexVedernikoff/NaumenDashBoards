// @flow
import PanelPointContentValue from 'components/molecules/PanelPointContentValue';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './PanelPointContent.less';

export class PanelPointContent extends Component<Props> {
	renderText () {
		const {option: {label}} = this.props;
		return <div className={styles.text}>{label}</div>;
	}

	renderValues () {
		const {option: {value}} = this.props;
		return value.map((val, id) => <PanelPointContentValue key={id} value={val} />);
	}

	render () {
		const {option: {value}} = this.props;

		if (value.length) {
			return (
				<div className={styles.container}>
					{this.renderText()}
					{this.renderValues()}
				</div>
			);
		}

		return null;
	}
}

export default PanelPointContent;
