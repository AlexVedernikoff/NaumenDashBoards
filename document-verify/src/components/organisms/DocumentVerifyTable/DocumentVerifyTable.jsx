// @flow
import AlertIcon from 'icons/alert.svg';
import Button from 'components/atoms/Button';
import cn from 'classnames';
import ErrorIcon from 'icons/error.svg';
import type {Props} from 'containers/DocumentVerifyTable/types';
import React, {Component} from 'react';
import styles from './styles.less';
import SuccessIcon from 'icons/success.svg';

export default class DocumentVerifyTable extends Component<Props> {
	constructor (props) {
		super(props);
		this.state = {
			activeUUID: null,
			isDocGenerationDisabled: true
		};

		const {verify: {data: {entities, html}}} = this.props;

		this.timer = setTimeout(() => {
			if (html) {
				entities.forEach(this.searchValueError);

				clearTimeout(this.timer);
			}
		}, 100);
	}

	setActiveUUID (activeUUID) {
		this.setState({activeUUID});
	}

	scrollToTable (UUID) {
		const {height: trHeight, top: trTop} = document.getElementById(UUID).getBoundingClientRect();
		const tableScroll = document.getElementById('tableScroll');
		const {height, top} = tableScroll.getBoundingClientRect();
		tableScroll.scrollTop += Math.floor(trTop - top - height / 2 + trHeight / 2);
	}

	scrollToError (UUID) {
		this.setActiveUUID(UUID);

		const del = document.getElementById(`${UUID}_del`);
		const ins = document.getElementById(`${UUID}_ins`);

		if (del) {
			this.animate(del);
		}

		if (ins) {
			this.animate(ins);
		}
	}

	animate (element) {
		element.scrollIntoView({block: 'center'});
		element.style.opacity = 0;

		const interval = window.setInterval(function () {
			if (element.style.opacity < 1) {
				return (element.style.opacity = +element.style.opacity + 0.1);
			}

			clearInterval(interval);
		}, 30);
	}

	handleChangeEntity = (state, {UUID}) => {
		this.setState({isDocGenerationDisabled: false});
		const {sendEntityStatus, setVerifyData, verify: {data: {entities, html}}} = this.props;

		const skipEntity = entities.map(entity => {
			if (entity.UUID === UUID) {
				entity.state = state;
			}

			return entity;
		});

		skipEntity.forEach(this.searchValueError);

		sendEntityStatus(UUID, state);
		setVerifyData({entities: skipEntity, html});

		const isError = skipEntity.some(({state}) => state === 'error');
		this.setState({isDocGenerationDisabled: isError});
	};

	getListControlShow ({state}) {
		return {
			abort: state === 'fixed' || state === 'skipped',
			error: state === 'error'
		};
	}

	getEntityIcon (state) {
		switch (state) {
			case 'skipped':
				return <AlertIcon className={styles.icon} />;
			case 'error':
				return <ErrorIcon className={styles.icon} />;
			default:
				return <SuccessIcon className={styles.icon} />;
		}
	}

	getEntityErrorCount () {
		const {verify: {data: {entities}}} = this.props;
		return entities.filter(({state}) => state === 'error').length;
	}

	getControlButtonProps (type, entity) {
		const show = this.getListControlShow(entity);

		const props = {
			onClick: this.handleChangeEntity.bind(this, type, entity),
			show: false,
			title: ''
		};

		switch (type) {
			case 'fixed':
				return {
					...props,
					show: show.error,
					title: 'Исправить'
				};
			case 'skipped':
				return {
					...props,
					show: show.error,
					title: 'Пропустить'
				};
			case 'error':
				return {
					...props,
					show: show.abort,
					title: 'Отменить'
				};
		}
	}

	handleCreateDocument = async () => {
		const {sendGenerateDocument} = this.props;

		this.setState({isDocGenerationDisabled: true});
		await sendGenerateDocument();

		const {verify: {notification: {isSuccess, show}}} = this.props;

		if (!isSuccess && show) {
			this.setState({isDocGenerationDisabled: false});
		}
	};

	handleRowClick = UUID => () => {
		this.scrollToError(UUID);
	};

	searchValueError = ({UUID, state}) => {
		const del = document.querySelector(`del[style*="${UUID}"]`) || document.getElementById(`${UUID}_del`);
		const ins = document.querySelector(`ins[style*="${UUID}"]`) || document.getElementById(`${UUID}_ins`);

		if (del) {
			del.setAttribute('id', `${UUID}_del`);

			if (state === 'fixed') {
				del.style.display = 'none';
			} else {
				del.style.display = 'inline';
				del.onclick = () => {
					this.scrollToTable(UUID);
					this.setActiveUUID(UUID);
				};
				const [span] = del.children;

				if (span) {
					span.style.backgroundColor = 'initial';
				}
			}

			if (state === 'skipped') {
				del.style.backgroundColor = '#D9BF8C';
			} else {
				del.style.backgroundColor = '#E08A85';
			}

			del.style.cursor = 'pointer';
			del.style.padding = '0 5px';
		}

		if (ins) {
			ins.setAttribute('id', `${UUID}_ins`);

			if (state === 'error' || state === 'skipped') {
				ins.style.display = 'none';
			} else {
				ins.style.display = 'inline';
				ins.onclick = () => {
					this.scrollToTable(UUID);
					this.setActiveUUID(UUID);
				};

				const [span] = ins.children;

				if (span) {
					span.style.backgroundColor = 'initial';
				}
			}

			ins.style.backgroundColor = '#94D1AD';
			ins.style.cursor = 'pointer';
			ins.style.padding = '0 5px';
		}
	};

	renderHeader () {
		return (
			<thead>
				<tr>
					<td>Проверка документа</td>
					<td>&nbsp;</td>
					<td>Ошибок в документе: {this.getEntityErrorCount()}</td>
				</tr>
				<tr>
					<td>Наименование</td>
					<td>Рекомендуемое значение</td>
					<td>Значение в документе</td>
				</tr>
			</thead>
		);
	}

	renderFooter () {
		return (
			<tfoot>
				<tr>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td className={styles.controlFooter}>
						<Button disabled={this.state.isDocGenerationDisabled} onClick={this.handleCreateDocument}>Сформировать документ</Button>
					</td>
				</tr>
			</tfoot>
		);
	}

	renderBody () {
		const {verify: {data: {entities}}} = this.props;
		return (
			<tbody id="tableScroll">
				{entities.map(this.renderTableRow)}
			</tbody>
		);
	}

	renderTableRow = entity => {
		const {UUID, state, title, valueAdvice, valueDoc} = entity;
		const classNames = cn({
			[styles.active]: this.state.activeUUID === UUID
		});

		return (
			<tr className={classNames} id={UUID} key={UUID} onClick={this.handleRowClick(UUID)}>
				<td>
					{this.getEntityIcon(state)}<span className={styles.title}>{title}</span>
				</td>
				<td>
					{valueAdvice}
				</td>
				<td className={styles.column}>
					<div>{valueDoc}</div>{this.renderEntityControls(entity)}
				</td>
			</tr>
		);
	};

	renderButton (type, entity) {
		const {onClick, show, title} = this.getControlButtonProps(type, entity);

		return show ? <button onClick={onClick}>{title}</button> : null;
	}

	renderEntityControls (entity) {
		return (
			<div className={styles.controlEntity}>
				{this.renderButton('fixed', entity)}
				{this.renderButton('skipped', entity)}
				{this.renderButton('error', entity)}
			</div>
		);
	}

	render () {
		const {switchView} = this.props;

		const classNames = cn({
			[styles.container]: true,
			[styles.containerSwitch]: switchView
		});

		return (
			<div className={classNames}>
				<table className={styles.table}>
					{this.renderHeader()}
					{this.renderBody()}
					{this.renderFooter()}
				</table>
			</div>
		);
	}
}
