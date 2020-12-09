// @flow
export class Resizer {
	initHeight: number;
	rootElement: HTMLElement | null;
	margin: number;

	constructor () {
		this.initHeight = window.innerHeight;
		this.rootElement = document.getElementById('root');
		this.margin = 32;
	}

	/**
	 * Получаем таким образом селекторы, т.к. имя класса генерируется хэшом и всегда разное
	 * @returns {number} - высота блока с селекторами в px
	 */
	getSelectorsOffset (): number {
		return (
			(this.rootElement
				&& this.rootElement.firstChild
				&& this.rootElement.firstChild.firstChild
				&& this.rootElement.firstChild.firstChild instanceof HTMLElement
				&& Number(this.rootElement.firstChild.firstChild.offsetHeight))
			|| 0
		);
	}

	isFullSize () {
		let isFullSize = true;

		if (window.parent) {
			const {
				innerHeight: parentHeight,
				innerWidth: parentWidth
			} = window.parent;
			const {innerHeight, innerWidth} = window;
			isFullSize = parentHeight === innerHeight && parentWidth === innerWidth;
		}

		return isFullSize;
	}

	shouldBeResized () {
		if (document.body) {
			return this.initHeight !== document.body.style.height;
		}

		return false;
	}

	/**
	 * Получить новую высоту календаря с учетом ресайза приложения
	 * @returns {void | string} - пересчитанная высота календаря
	 */
	getResizedHeigh () {
		if (this.rootElement && this.shouldBeResized()) {
			const isFullSize = this.isFullSize();
			const selectorsOffset = this.getSelectorsOffset();

			if (!isFullSize && document.body) {
				document.body.style.height = `${this.initHeight}px`;
			}

			return isFullSize
				? `${window.innerHeight - selectorsOffset - this.margin}px`
				: `${this.initHeight - selectorsOffset - this.margin}px`;
		}
	}
}

export default Resizer;
