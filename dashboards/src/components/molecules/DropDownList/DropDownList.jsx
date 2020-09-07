// @flow
import {Header, List, ListItem} from './components';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';

export class DropDownList extends PureComponent<Props, State> {
	static defaultProps = {
		components: {}
	};

	components = {
		Header,
		List,
		ListItem
	};

	state = {
		showList: false
	};

	getComponents = () => ({...this.components, ...this.props.components});

	toggleShowList = () => this.setState({showList: !this.state.showList});

	render () {
		const {expand, onSelect, options, title} = this.props;
		const showList = expand || this.state.showList;
		const {Header, List, ListItem} = this.getComponents();

		return (
			<Fragment>
				<Header className={styles.header} onClickCaret={this.toggleShowList} showList={showList} title={title} />
				<List components={{ListItem}} onSelect={onSelect} options={options} show={showList} />
			</Fragment>
		);
	}
}

export default DropDownList;
