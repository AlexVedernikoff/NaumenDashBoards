// @flow
import cn from 'classnames';
import type {Props} from './types';
import React from 'react';
import {setActiveTab} from 'store/App/actions';
import styles from './styles.less';
import {useDispatch, useSelector} from 'react-redux';

const dataTabs = [
	{
		id: 'params',
		text: 'Параметры'
	},
	{
		id: 'styles',
		text: 'Стиль'
	}
];

const Tabs = (props: Props) => {
	const activeTab = useSelector(state => state.APP.activeTab);
	const dispatch = useDispatch();

	const toggle = id => () => {
		dispatch(setActiveTab(id));
	};

	const renderTabs = () => {
		return dataTabs.map(tab => {
			const CN = cn({
				[styles.active]: tab.id === activeTab
			});
			return <h3 className={CN} key={tab.id} onClick={toggle(tab.id)}>{tab.text}</h3>;
		});
	};

	return (
		<div className={styles.tabs}>
			{renderTabs()}
		</div>
	);
};

export default Tabs;
