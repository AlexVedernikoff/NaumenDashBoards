// @flow
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './PanelPointContent.less';

export class PanelPointContent extends Component<Props> {
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

	renderText () {
		const {option: {label}} = this.props;
		return <div className={styles.text}>{label}</div>;
	}

	renderValue () {
		const {option: {value}} = this.props;
		const text = this.truncate(value.label, 255);

		if (value.url) {
			const props = {
				className: styles.link,
				href: value.url,
				rel: 'noreferrer',
				target: '_blank'
			};

			return <a {...props}>{text}</a>;
		}

		return <div className={styles.link}>{text}</div>;
	}

	render () {
		const {option: {value}} = this.props;

		if (value) {
			return (
				<div className={styles.container}>
					{this.renderText()}
					{this.renderValue()}
					{value.label.length > 255 && this.renderTextFull()}
				</div>
			);
		}

		return null;
	}
}

export default PanelPointContent;
