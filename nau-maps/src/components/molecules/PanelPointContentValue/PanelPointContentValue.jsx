// @flow
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './PanelPointContentValue.less';

export class PanelPointContentValue extends Component<Props> {
	constructor (props: Props) {
		super(props);

		this.state = {
			viewTextFull: false
		};
	}

	changeViewText = () => {
		this.setState({viewTextFull: !this.state.viewTextFull});
	};

	truncate = (str, n) => {
		return str.length > n && !this.state.viewTextFull ? str.substr(0, n - 1) : str;
	};

	renderTextFull () {
		const text = this.state.viewTextFull ? 'Скрыть' : 'Показать подробнее...';
		return <div className={styles.textFull} onClick={this.changeViewText}>{text}</div>;
	}

	renderValue () {
		const {value: {label, url}} = this.props;
		const text = this.truncate(label, 255);

		if (url) {
			const props = {
				className: styles.link,
				href: url,
				rel: 'noreferrer',
				target: '_blank'
			};

			return <a {...props}>{text}</a>;
		}

		return <div className={styles.link}>{text}</div>;
	}

	render () {
		const {value: {label}} = this.props;
		return (
			<div>
				{this.renderValue()}
				{label.length > 255 && this.renderTextFull()}
			</div>
		);
	}
}

export default PanelPointContentValue;
