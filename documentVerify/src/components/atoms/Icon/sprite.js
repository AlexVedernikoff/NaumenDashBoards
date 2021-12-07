// @flow
import type {IconName, Symbol} from './types';

class Sprite {
	mounted = false;
	sprite = null;
	symbols: Array<Symbol> = [];

	createSprite = () => {
		this.sprite = this.parse(`
			<svg xmlns="http://www.w3.org/2000/svg" style="display: none">
				<def>${this.symbols.map(this.createSymbol).join('')}</def>
			</svg>
		`);
	};

	createSymbol = ({content, id}: Symbol) => `<symbol id="${id}">${content}</symbol>`;

	mount = () => {
		if (document.body && this.sprite && !this.mounted) {
			document.body.appendChild(this.sprite);
			this.mounted = true;
		}
	};

	parse = (svg: string) => new DOMParser().parseFromString(this.stringify(svg), 'image/svg+xml').documentElement;

	stringify = (string: string) => string.replace(/\n|\r|\t|\v/gi, '');

	add (id: IconName, content: string) {
		this.symbols.push({content, id});
	}

	render () {
		this.createSprite();

		if (document.body) {
			this.mount();
		} else {
			document.addEventListener('DOMContentLoaded', this.mount);
		}
	}
}

export default Sprite;
