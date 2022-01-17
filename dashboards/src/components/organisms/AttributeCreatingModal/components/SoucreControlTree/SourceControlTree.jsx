// @flow
import CreationPanel from 'components/atoms/CreationPanel';
import {getMapValues} from 'helpers';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import t from 'localization';
import Tree from 'components/molecules/TreeSelect/components/Tree';
import type {Tree as TreeType} from 'components/molecules/TreeSelect/types';

export class SourceControlTree extends PureComponent<Props> {
	countAttributes = (options: TreeType) => getMapValues(options).filter(node => node.parent).length;

	renderAddConstantButton = () => {
		const {onAddConstant, searchValue} = this.props;

		return !searchValue ? <CreationPanel onClick={onAddConstant} text={t('SourceControlTree::AddConstants')} /> : null;
	};

	renderFoundInfo = () => {
		const {options, originalOptions, searchValue} = this.props;

		if (searchValue) {
			const countAttributes = this.countAttributes(originalOptions);
			const countFoundAttributes = this.countAttributes(options);
			const info = t('SourceControlTree::Find', {countAttributes, countFoundAttributes});

			return <div className={styles.searchInfo}>{info}</div>;
		}
	};

	renderSearchInfo = () => {
		const {searchValue} = this.props;

		if (searchValue) {
			return (
				<div className={styles.searchValue}>
					<span>{t('SourceControlTree::Contains')}</span>
					{searchValue}
				</div>
			);
		}
	};

	renderTree = () => {
		const {onAddConstant, originalOptions, ...props} = this.props;

		return <Tree {...props} />;
	};

	render () {
		return (
			<Fragment>
				{this.renderSearchInfo()}
				{this.renderTree()}
				{this.renderFoundInfo()}
				{this.renderAddConstantButton()}
			</Fragment>
		);
	}
}

export default SourceControlTree;
