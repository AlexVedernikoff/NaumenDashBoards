// @flow
import {connect} from 'react-redux';
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
			actionShow: false
		};
	}

	showSingle = () => {
		const {showSinglePoint} = this.props;

		if (!showSinglePoint) {
			const {geoposition, pointData, setSinglePoint, type} = this.props;

			this.setState({actionShow: false});
			if (!geoposition) {
				const {header} = pointData;

				notify('single', 'info', header);
			}
			const data = {
				geoposition,
				data: [pointData],
				type
			};

			setSinglePoint(data);
		}
	}

	showAction = () => this.setState({actionShow: true});

	hideAction = () => this.setState({actionShow: false});

	renderOption = (option: Option, id: number) => <PanelPointContent option={option} key={`option_${id}`} />;

	render () {
		const {pointData, showSinglePoint, statusColor} = this.props;
		const {actions, header, options, uuid} = pointData;
		const {actionShow} = this.state;
		const showKebab = (actionShow && actions.length);
		const pointContainerCN = showSinglePoint ? styles.pointSingleContent : styles.pointContent;

		return (
			<div className={styles.pointContainer}>
				<div
					onMouseOver={this.showAction}
					onMouseLeave={this.hideAction}
					onClick={this.showSingle}
					className={pointContainerCN}
					style={{borderLeft: `4px ${statusColor} solid`}}
				>
					{header && <PanelPointHeader
						header={header}
						actions={actions}
						showKebab={showKebab}
						uuid={uuid}
					/>}
					{options && options.map(this.renderOption)}
				</div>
			</div>
		);
	}
}
export default connect(props, functions)(PanelPoint);
