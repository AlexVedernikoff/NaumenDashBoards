// @flow
import cn from 'classnames';
import type {DataSource} from 'store/sources/data/types';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import {SearchOptionInput} from 'components/atoms';
import styles from './styles.less';
import {ToggleCollapsedIcon, ToggleExpandedIcon} from 'icons/form';

export class SourceTree extends PureComponent<Props, State> {
	static defaultProps = {
		className: ''
	};

	state = {
		expanded: [],
		foundSources: [],
		searchValue: ''
	};

	componentDidMount () {
		this.expandSelected();
	}

	addFoundSourceParents = (foundSources: Array<string>, value: string | null) => {
		const {sources} = this.props;

		if (value) {
			const source = sources[value];
			const {parent} = source;

			if (parent) {
				if (!foundSources.includes(parent)) {
					foundSources.push(parent);
				}

				this.addFoundSourceParents(foundSources, parent);
			}
		}
	};

	expandSelected = () => {
		const {sources, value: currentSource} = this.props;

		if (currentSource) {
			const expanded = [];
			let source = sources[currentSource.value];

			while (source.parent) {
				expanded.push(source.parent);
				// $FlowFixMe
				source = sources[source.parent];
			}

			this.setState({expanded});
		}
	};

	getClassName = () => cn(styles.container, this.props.className);

	handleChangeSearchInput = (searchValue: string) => {
		const {sources} = this.props;
		const reg = new RegExp(searchValue, 'i');
		let foundSources = [];
		// $FlowFixMe
		foundSources = (Object.values(sources): Array<DataSource>)
			.filter(source => reg.test(source.title))
			.map(source => source.value);

		foundSources.forEach(source => this.addFoundSourceParents(foundSources, source));

		this.setState({foundSources, searchValue});
	};

	handleClickToggleIcon = (e: SyntheticMouseEvent<HTMLElement>) => {
		const {value} = e.currentTarget.dataset;
		let {expanded} = this.state;
		expanded = expanded.includes(value) ? expanded.filter(v => v !== value) : [...expanded, value];

		e.stopPropagation();
		this.setState({expanded});
	};

	handleClickTitle = (e: SyntheticMouseEvent<HTMLDivElement>) => {
		const {onSelect, sources} = this.props;
		const {value} = e.currentTarget.dataset;
		const {title: label} = sources[value];

		onSelect({value, label});
	};

	isExpanded = (value: string) => {
		const {expanded, searchValue} = this.state;
		return searchValue || expanded.includes(value);
	};

	isRoot = (source: DataSource) => !source.parent;

	renderChildren = (source: DataSource) => {
		const {sources} = this.props;
		const {children, value} = source;
		const isExpanded = this.isExpanded(value);

		if (isExpanded && children.length > 0) {
			return (
				<div className={styles.children}>
					{children.map(key => this.renderNode(sources[key]))}
				</div>
			);
		}
	};

	renderNode = (source: DataSource) => {
		const {foundSources, searchValue} = this.state;
		const {value} = source;

		if (!searchValue || foundSources.includes(value)) {
			return (
				<Fragment>
					<div className={styles.node} key={value}>
						{this.renderToggleIcon(source)}
						{this.renderTitle(source)}
					</div>
					{this.renderChildren(source)}
				</Fragment>
			);
		}
	};

	renderSearchInput = () => <SearchOptionInput onChange={this.handleChangeSearchInput} value={this.state.searchValue} />;

	renderTitle = (source: DataSource) => {
		const {value: currentSource} = this.props;
		const {searchValue} = this.state;
		const {title, value} = source;
		let isSelected = false;
		let isFound = false;

		if (currentSource && currentSource.value === value) {
			isSelected = true;
		}

		if (searchValue && title.toLowerCase().includes(searchValue.toLowerCase())) {
			isFound = true;
		}

		return (
			<div
				className={styles.title}
				data-found={isFound}
				data-selected={isSelected}
				data-value={value}
				onClick={this.handleClickTitle}
			>
				{title}
			</div>
		);
	};

	renderToggleIcon = (source: DataSource) => {
		const {children, value} = source;
		const hasNotChildren = children.length === 0;
		const isExpanded = this.isExpanded(value);

		return (
			<div className={styles.toggleIcon} data-invisible={hasNotChildren} data-value={value} onClick={this.handleClickToggleIcon}>
				{isExpanded ? <ToggleExpandedIcon /> : <ToggleCollapsedIcon />}
			</div>
		);
	};

	renderTree = () => {
		const {sources} = this.props;
		const {foundSources, searchValue} = this.state;
		// $FlowFixMe
		let arr: Array<DataSource> = Object.values(sources);

		if (searchValue) {
			arr = arr.filter(source => foundSources.includes(source.value));
		}

		return (
			<div className={styles.tree}>
				{arr.filter(this.isRoot).map(this.renderNode)}
			</div>
		);
	};

	render () {
		return (
			<div className={this.getClassName()}>
				{this.renderSearchInput()}
				{this.renderTree()}
			</div>
		);
	}
}

export default SourceTree;
