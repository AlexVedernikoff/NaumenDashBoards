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
		return <div onClick={this.changeViewText}>{!this.state.viewTextFull ? 'Показать подробнее...' : 'Скрыть' }</div>;
	}

	renderText () {
		const {option: {label}} = this.props;
		return (
			<div className={styles.text}>{label}</div>
		);
	}

	renderLink () {
		const {option: {value}} = this.props;

		if (value.url) {
			return <a className={styles.link} href={value.url} rel="noreferrer" target="_blank">{value.label}</a>;
		} else {
			return <div className={styles.link}>
				{this.truncate(value.label, 255)}
				{value.label.length > 255 && this.renderTextFull()}
			</div>;
		}
	}

	render () {
		const {option: {value}} = this.props;

		if (value) {
			return (
				<div className={styles.container}>
					{this.renderText()}
					{this.renderLink()}
				</div>
			);
		}

		return null;
	}
}

export default PanelPointContent;
