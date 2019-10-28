// @flow
import ExportIcon from 'icons/header/export.svg';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

export class DropDownFiles extends Component<Props> {
	static defaultProps = {
		createDoc: (t: string) => t,
		icon: false,
		list: [],
		title: ''
	};

	selectMenu = (event: SyntheticEvent<HTMLButtonElement>) => {
		const doc = String(event.currentTarget.getAttribute('data-doc-type'));
		this.props.createDoc(doc);
	};

	renderButton = () => {
		const {icon, title} = this.props;

		return (
			<button className={styles.dropdownButton}>
				{icon ? <ExportIcon/> : title}
			</button>
		);
	};

	renderContentItem = (item: {text: string}) => (
		<button key={item.text} onClick={this.selectMenu} data-doc-type={item.text}>
			{item.text}
		</button>
	);

	renderContent = () => {
		const {list} = this.props;

		return (
			<div className={styles.dropdownContent}>
				{list.map(this.renderContentItem)}
			</div>
		);
	};

	render () {
		return (
			<div className={styles.dropdown}>
				{this.renderButton()}
				{this.renderContent()}
			</div>
		);
	}
}

export default DropDownFiles;
