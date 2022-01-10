// @flow
import AlertIcon from 'icons/alert.svg';
import cn from 'classnames';
import ErrorIcon from 'icons/error.svg';
import type {Props} from 'containers/DocumentVerifyTable/types';
import React, {useEffect, useState} from 'react';
import styles from './styles.less';
import SuccessIcon from 'icons/success.svg';


const DocumentVerifyTable = ({switchView, verify: {data: {entities, html}}}: Props) => {
	const [activeUUID, setActiveUUID] = useState(null);

	const scrollToTable = UUID => {
		const {height: trHeight, top: trTop} = document.getElementById(UUID).getBoundingClientRect();
		const tableScroll = document.getElementById('tableScroll');
		const {height, top} = tableScroll.getBoundingClientRect();
		tableScroll.scrollTop += Math.floor(trTop - top - height / 2 + trHeight / 2);
	};

	const animate = (element, opacity = 0) => {
		element.scrollIntoView({block: 'center'});
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


		if (ins) {
			const insStyle = ins.getAttribute('style');

			if (state === 'error' || state === 'skipped') {
				ins.style.display = 'none';
			} else {
				ins.onclick = () => {
					scrollToTable(UUID);
					setActiveUUID(UUID);
				};
			}

			ins.style.backgroundColor = '#94D1AD';
			ins.style.cursor = 'pointer';
			ins.style.padding = '0 5px';
			ins.setAttribute('style', `${ins.style.cssText} ${insStyle}`);
		}

		if (del) {
			const delStyle = del.getAttribute('style');

			if (state === 'fixed') {
				del.style.display = 'none';
			} else {
				del.onclick = () => {
					scrollToTable(UUID);
					setActiveUUID(UUID);
				};
			}

			del.style.backgroundColor = '#E08A85';
			del.style.cursor = 'pointer';
			ins.style.padding = '0 5px';
			del.setAttribute('style', `${del.style.cssText} ${delStyle}`);
		}
	};

	const scrollToError = ({UUID}) => {
		setActiveUUID(UUID);

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
		const timer = setTimeout(() => {
			if (html) {
				entities.forEach(searchValueError);
			}
		}, 100);

		return () => clearTimeout(timer);
	}, [html]);

	return (
		<div className={cn({
			[styles.container]: true,
			[styles.containerSwitch]: switchView
		})}>
			<table className={styles.table}>
				<thead>
					<tr>
						<td>Проверка документа</td>
						<td>&nbsp;</td>
						<td>Ошибок в документе: {entities.filter(({state}) => state === 'error').length}</td>
					</tr>
					<tr>
						<td>Наименование</td>
						<td>Рекомендуемое значение</td>
						<td>Значение в документе</td>
					</tr>
				</thead>
				<tbody id='tableScroll'>
					{entities.map(entity => {
						return (
							<tr className={cn({
								[styles.active]: activeUUID === entity.UUID
							})} id={entity.UUID} key={entity.UUID} onClick={() => { scrollToError(entity); }}>
								<td>{getTypeIcon(entity)}<span className={styles.title}>{entity.title}</span></td>
								<td>{entity.valueAdvice}</td>
								<td>{entity.valueDoc}</td>
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
		</div>
	);
};

export default DocumentVerifyTable;
