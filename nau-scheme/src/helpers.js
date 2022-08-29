// @flow
/**
 * Функция, которая устанавливает высоту встройки по высоте родительского окна
 */
function setHeight () {
	const {body} = document;
	const height = `${window.frameElement.height}px`;

	if (body.style.height !== height) {
		body.style.height = height;
	}
}

export {
	setHeight
};
