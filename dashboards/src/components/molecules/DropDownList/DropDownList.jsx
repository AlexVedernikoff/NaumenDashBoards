// @flow
import {Header as DefaultHeader, List as DefaultList, ListItem as DefaultListItem} from './components';
import type {Node, Value} from 'components/molecules/MultiDropDownList/types';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';

export class DropDownList extends PureComponent<Props, State> {
	static defaultProps = {
		components: {}
	};

	state = {
		showList: false
	};

	getRootValue = (): Value => {
		const {children, ...value} = this.props.value;
		return value;
	};

	handleClick = () => this.props.onSelect(this.getRootValue());

	handleSelect = (value: Node) => {
		const {onSelect} = this.props;
		onSelect({...value, parent: this.getRootValue()});
	};

	toggleShowList = () => this.setState({showList: !this.state.showList});

	renderHeader = () => {
		const {expand, value} = this.props;
		const {label} = value;
		const showList = expand || this.state.showList;
		const {Header = DefaultHeader} = this.props.components;

		return (
			<Header
				className={styles.header}
				onClick={this.handleClick}
				onClickCaret={this.toggleShowList}
				showList={showList}
				title={label}
			/>
		);
	};

	renderList = () => {
		const {components, expand, value} = this.props;
		const {children: options} = value;
		const showList = expand || this.state.showList;
		const {List = DefaultList, ListItem = DefaultListItem} = components;

		return <List components={{ListItem}} onSelect={this.handleSelect} options={options} show={showList} />;
	};

	render () {
		return (
			<Fragment>
				{this.renderHeader()}
				{this.renderList()}
			</Fragment>
		);
	}
}

export default DropDownList;
