import {Plugin} from 'obsidian';

function legend_colors(legend: string): Map {
	let color_map = new Map();
	const legend_rows = legend.split('\n').filter((row) => row.length > 0);
	for (let r = 0; r < legend_rows.length; r++) {
		let row = legend_rows[r].split(' ');
		let character = row[1];
		let color = row[2];
		color_map.set(character, color);
	}
	return color_map;
}

function char_color(color_map: Map, character: string): string {
	if (color_map.has(character)) {
		return color_map.get(character);
	} else {
		return 'var(--background-primary)';
	}
}

export default class MyPlugin extends Plugin {
	processor: MarkdownPostProcessor;

	async onload() {
		this.processor = this.registerMarkdownCodeBlockProcessor('time-tracker', (source, el, ctx) => {
			const parts = source.split('\nLegend:\n');
			const data = parts[0];
			const legend = parts[1];
			const color_map = legend_colors(legend);
			const rows = data.split('\n').filter((row) => row.length > 0);

			const body = el.createEl('div', { cls: 'monospace' });

			for (let r = 0; r < rows.length; r++) {
				const row = body.createEl('div');
				if (rows[r] == "      0123456789TE0123456789TE") {
					row.createEl('span', { text: rows[r] });
				} else {
					for (let c = 0; c < rows[r].length; c++) {
						let character = rows[r][c];
						let attr = { 'style': 'background-color: ' + char_color(color_map, character) + ';' };
						row.createEl('span', { text: character, attr: attr});
					}
				}
			}
		});
	}

	onunload() {
		this.unregisterPostProcessor(this.processor);
	}
}
