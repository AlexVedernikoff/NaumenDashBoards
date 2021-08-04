// @flow
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import {Container, Icon, TreeSelect} from 'naumen-common-components';
import {createFilterContext, getFilterContext} from 'src/store/helpers';
import type {Props} from './types';
import React, {useState} from 'react';
import styles from './styles.less';

const Box = (props: Props) => {
	const {name, value} = props;
	const [select, setSelect] = useState(value);

	const changeSource = (source) => {
		const {onChange} = props;

		setSelect(source);
		onChange(source);
	};

	const handleRemoveSource = () => changeSource(null);

	const handleSelect = ({value: node}) => changeSource(node.value);

	const handleOpenFilterForm = async (): Promise<string | null> => {
		try {
			const {value: classFqn} = select;
			const context = select ? getFilterContext(select, classFqn) : createFilterContext(classFqn);
			const {serializedContext} = await window.jsApi.commands.filterForm(context);

			return serializedContext;
		} catch (e) {
			console.error('Ошибка окна фильтрации: ', e);
		}
	};

	const renderFilter = () => {
		const active = false;
		const iconName = active ? 'FILLED_FILTER' : 'FILTER';

		return (
			<div className={styles.filterButton} onClick={() => handleOpenFilterForm()}>
				<Icon name={iconName} />
				<span className={styles.desc}>Фильтрация</span>
			</div>
		);
	};

	const renderTreeSelect = () => {
		const {options} = props;

		return (
			<TreeSelect
				className={styles.sourceTreeSelect}
				onRemove={handleRemoveSource}
				onSelect={handleSelect}
				options={options}
				removable={true}
				value={select}
			/>
		);
	};

	return (
		<CollapsableFormBox title={name}>
			<Container className={styles.container}>
				{renderTreeSelect()}
				{renderFilter()}
			</Container>
		</CollapsableFormBox>
	);
};

export default Box;
