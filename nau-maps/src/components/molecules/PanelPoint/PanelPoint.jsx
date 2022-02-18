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
		const {showSingleObject} = this.props;

		if (!showSingleObject) {
			const {geoposition, pointData, setSingleObject, type} = this.props;

			this.setState({actionShow: false});

			if (!geoposition) {
				const {header} = pointData;
				notify('single', 'info', header);
			}

			const data = {
				geoposition,
				data: pointData,
				type
			};

			setSingleObject(data);
		}
	};

	showAction = () => this.setState({actionShow: true});

	hideAction = () => this.setState({actionShow: false});

	renderOption = (option: Option, id: number) => <PanelPointContent option={option} key={`option_${id}`} />;

	render () {
		const {pointData, showSingleObject, statusColor} = this.props;
		const {actions, header, options, uuid} = pointData;
		const {actionShow} = this.state;
		const showKebab = (actionShow && actions.length);
		const pointContainerCN = showSingleObject ? styles.pointSingleContent : styles.pointContent;

		return (
			<div className={styles.pointContainer}>
				<div
					className={pointContainerCN}
					onClick={this.showSingle}
					onMouseLeave={this.hideAction}
					onMouseOver={this.showAction}
					style={{borderLeft: `4px ${statusColor} solid`}}
				>
					{<PanelPointHeader
						actions={actions}
						header={header || 'Название отсутствует'}
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
