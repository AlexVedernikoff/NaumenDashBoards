// @flow
import AlertIcon from 'icons/alert.svg';
import cn from 'classnames';
import ErrorIcon from 'icons/error.svg';
import type {Props} from 'containers/DocumentVerifyTable/types';
import React, {useEffect, useState} from 'react';
import styles from './styles.less';
import SuccessIcon from 'icons/success.svg';

const DocumentVerifyTable = ({switchView, verify: {data: {entities}}}: Props) => {
	const [errors, setErrors] = useState(entities);

	const animate = (element, opacity = 0) => {
		element.scrollIntoView();
		window.setTimeout(function () {
			const style = (element.getAttribute('style') || '').replace(/opacity[^;]+;\s+/gi, '');
			element.setAttribute('style', `opacity: ${opacity}; ${style}`);

			if (opacity < 1) {
				animate(element, opacity + 0.1);
			}
		}, 30);
	};

	const searchValueError = ({UUID, state}) => {
		const del = document.querySelector(`del[style*="${UUID}"]`);
		const ins = document.querySelector(`ins[style*="${UUID}"]`);

		const delStyle = del && del.getAttribute('style');
		const insStyle = ins && ins.getAttribute('style');

		if (ins) {
			ins.style.backgroundColor = '#348416';

			if (state === 'error' || state === 'skipped') {
				ins.style.display = 'none';
			} else {
				ins.onclick = () => {
					animate(document.getElementById(UUID));
				};
			}

			ins.setAttribute('style', `${ins.style.cssText} ${insStyle}`);
		}

		if (del) {
			del.style.backgroundColor = '#cb2d2d';

			if (state === 'fixed') {
				del.style.display = 'none';
			} else {
				del.onclick = () => {
					animate(document.getElementById(UUID));
				};
			}

			del.setAttribute('style', `${del.style.cssText} ${delStyle}`);
		}

		return {
			entityValueFromSC: del?.innerText || '-',
			entityValueFromText: ins?.innerText || '-'
		};
	};

	const scrollToError = ({UUID}) => {
		const del = document.querySelector(`del[style*="${UUID}"]`);
		const ins = document.querySelector(`ins[style*="${UUID}"]`);

		if (del) {
			animate(del);
		}

		if (ins) {
			animate(ins);
		}
	};

	const getTypeIcon = ({state}) => {
		switch (state) {
			case 'skipped':
				return <AlertIcon className={styles.icon} />;
			case 'error':
				return <ErrorIcon className={styles.icon} />;
			default:
				return <SuccessIcon className={styles.icon} />;
		}
	};

	useEffect(() => {
		setErrors(entities.map(entity => {
			return {...entity, ...searchValueError(entity)};
		}));
	}, [entities]);

	return (
		<table className={cn({
			[styles.table]: true,
			[styles.tableSwitch]: switchView
		})}>
			<thead>
				<tr>
					<td>Проверка документа</td>
					<td>&nbsp;</td>
					<td>Ошибок в документе: {entities.filter(({equal}) => !equal).length}</td>
				</tr>
				<tr>
					<td>Наименование</td>
					<td>Рекомендуемое значение</td>
					<td>Значение в документе</td>
				</tr>
			</thead>
			<tbody>

				{errors.map(entity => {
					return (
						<tr id={entity.UUID} key={entity.UUID} onClick={() => { scrollToError(entity); }}>
							<td>{getTypeIcon(entity)}{entity.title}</td>
							<td>{entity.entityValueFromText}</td>
							<td>{entity.entityValueFromSC}</td>
						</tr>
					);
				})}
			</tbody>
			<tfoot>
				<tr>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
				</tr>
			</tfoot>
		</table>
	);
};

export default DocumentVerifyTable;
