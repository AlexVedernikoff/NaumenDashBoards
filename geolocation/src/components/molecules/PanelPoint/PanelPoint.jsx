// @flow
import {connect} from 'react-redux';;
import {functions, props} from './selectors';
import PanelPointContent from 'components/atoms/PanelPointContent';
import PanelPointHeader from 'components/atoms/PanelPointHeader';
import type {Props, State} from './types';
import React, {Component} from 'react';
import type {Option} from 'types/option';

export class PanelPoint extends Component<Props, State> {
	constructor (props: Object) {
		super(props);
		this.state = {
			actionShow: false,
		};
	}

	toggleActionShow = () => this.setState({actionShow: !this.state.actionShow});

	renderOption = (option: Option, id: number) => <PanelPointContent option={option} key={`option_${id}`} />;

	render () {
		const {actions, header, options, statusColor , uuid} = this.props;
		const {actionShow} = this.state;
		const showKebab = (actionShow && actions.length) ? true : false;

		return (
			<div
				onMouseEnter={this.toggleActionShow}
				onMouseLeave={this.toggleActionShow}
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
