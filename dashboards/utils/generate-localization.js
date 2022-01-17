const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const BASE_PATH = 'src/localization/json';
const EMPTY = '__EMPTY';

const wb = XLSX.readFile(path.join(BASE_PATH, 'localization.xlsx'));
const sheet = wb.Sheets['localization'];

const data = XLSX.utils.sheet_to_json(sheet);

if (data.length > 0) {
	const langs = Object.keys(data[0]).filter(name => name !== EMPTY);
	const files = {};

	langs.forEach(name => {
		files[name] = {};
	});

	data.forEach(row => {
		const key = row[EMPTY];

		langs.forEach(lang => {
			let val = row[lang] ?? '';

			// Объекты плюризации
			if (val && val.startsWith('{')) {
				try {
					val = JSON.parse(val.replace(/[“”]/g, '"')); // автозамена в excel
				} catch (e) {
					console.log(`Возможно ошибка разбора ${key} для ${lang}`);
				}
			}

			files[lang][key] = val;
		});
	});

	Object.entries(files).forEach(([name, data]) => {
		const filePath = path.join(BASE_PATH, `${name}.json`);
		const fileData = JSON.stringify(data, null, '\t');

		fs.writeFileSync(filePath, fileData);
	});
}
