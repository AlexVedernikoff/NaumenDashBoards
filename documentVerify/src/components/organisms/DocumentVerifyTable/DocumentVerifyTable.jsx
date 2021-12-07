// @flow
import AlertIcon from 'icons/alert.svg';
import type {Props} from 'containers/DocumentVerifyTable/types';
import React from 'react';
import styles from './styles.less';

const DocumentVerifyTable = ({verify}: Props) => {
	return (
		<table className={styles.table}>
			<thead>
				<tr>
					<td>Проверка документа</td>
					<td>&nbsp;</td>
					<td>Ошибок в документе: 999</td>
				</tr>
				<tr>
					<td>Наименование</td>
					<td>Рекомендуемое значение</td>
					<td>Значение в документе</td>
				</tr>
			</thead>
			<tbody>

				{verify.data.entities.map(entity => {
					return (
						<tr key={entity.idInText}>
							<td><AlertIcon className={styles.icon} />{entity.state}</td>
							<td>{entity.state}</td>
							<td>{entity.state}</td>
						</tr>
					);
				})}
			</tbody>
			<tfoot>
				<tr>
					<td colSpan={3}>&nbsp;</td>
				</tr>
			</tfoot>
		</table>
	);
};

export default DocumentVerifyTable;
