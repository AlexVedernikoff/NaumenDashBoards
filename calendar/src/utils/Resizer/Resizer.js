// @flow
export class Resizer {
	initHeight: number;
	rootElement: HTMLElement | null;
	selectorsOffset: number;
	margin: number;

	constructor () {
		this.initHeight = window.innerHeight;
		this.rootElement = document.getElementById('root');
		this.margin = 32;
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

	shouldUpdate () {
		if (document.body) {
			return this.initHeight !== document.body.style.height;
		}

		return false;
	}

	setHeight () {
		if (this.rootElement) {
			// NOTE: Получаем таким образом селекторы, т.к. имя класса генерируется хэшом и всегда разное
			this.selectorsOffset
				= (this.rootElement.firstChild
				&& this.rootElement.firstChild.firstChild
				&& this.rootElement.firstChild.firstChild instanceof HTMLElement
				&& Number(this.rootElement.firstChild.firstChild.offsetHeight)) || 0;
			const newHeight = `${this.initHeight}px`;

			if (document.body) {
				document.body.style.height = newHeight;
				return `${this.initHeight - this.selectorsOffset - this.margin}px`;
			}
		}
	}

	resize (setCalendarHeigth: (heigth: string) => void) {
		const shouldUpdate = this.shouldUpdate();

		if (shouldUpdate) {
			const isFullSize = this.isFullSize();
			setCalendarHeigth(`${(isFullSize ? window.innerHeight : this.initHeight) - this.selectorsOffset - this.margin}px`);
		}
	}
}

export default Resizer;
