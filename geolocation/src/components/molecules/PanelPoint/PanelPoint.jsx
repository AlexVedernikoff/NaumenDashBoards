// @flow
import {connect} from 'react-redux';;
import {functions, props} from './selectors';
import {notify} from 'helpers/notify';
import PanelPointContent from 'components/atoms/PanelPointContent';
import PanelPointHeader from 'components/atoms/PanelPointHeader';
import type {Props, State} from './types';
import React, {Component} from 'react';
import type {Option} from 'types/option';
import styles from './PanelPoint.less';

export class PanelPoint extends Component<Props, State> {
	constructor (props: Object) {
		super(props);
		this.state = {
			actionShow: false,
		};
	}

	showSingle = () => {
		const {geoposition, pointData, showSinglePoint, setSinglePoint, type} = this.props;

		if(geoposition) {
			const data = {
				geoposition,
				data: [pointData],
				type
			};

			!showSinglePoint && setSinglePoint(data);
		} else {
			const {header} = pointData;

			notify('single', 'info', header);
		}
	}

	toggleActionShow = () => this.setState({actionShow: !this.state.actionShow});

	renderOption = (option: Option, id: number) => <PanelPointContent option={option} key={`option_${id}`} />;

	render () {
		const {pointData, statusColor} = this.props;
		const {actions, header, options, uuid} = pointData;
		const {actionShow} = this.state;
		const showKebab = (actionShow && actions) ? true : false;

		return (
			<div
				onMouseEnter={this.toggleActionShow}
				onMouseLeave={this.toggleActionShow}
				onClick={this.showSingle}
				className={styles.pointContainer}
			>
				{header && <PanelPointHeader
					header={header}
					actions={actions}
					statusColor={statusColor}
					showKebab={showKebab}
					uuid={uuid}
				/>}
				{options && options.map(this.renderOption)}
			</div>
		);
	};
}
export default connect(props, functions)(PanelPoint);
