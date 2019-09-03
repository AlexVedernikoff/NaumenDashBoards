// @flow
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import type {ConnectedFunctions, ConnectedProps, Props} from './flow';
import type {Dispatch, State} from 'types';
import {increment} from 'actions/app';
import React, {Component} from 'react';

export class ButtonWithCounter extends Component<Props> {
	props: Props;

	handleClick = () => {
		const {increment} = this.props;
		increment && increment();
	};

	render () {
		const {counter} = this.props;

		return (
			<div>
				<button onClick={this.handleClick}>Кнопка</button>
				{' '}
				<span>{counter}</span>
			</div>
		);
	}
}

const mapStateToProps = (state: State): ConnectedProps => ({
	counter: state.app.counter
});

const mapDispatchToProps = (dispatch: Dispatch): ConnectedFunctions => ({
	increment: bindActionCreators(increment, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ButtonWithCounter);
