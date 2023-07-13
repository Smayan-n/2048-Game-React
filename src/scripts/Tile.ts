import { createRef } from "react";

class Tile {
	private row: number;
	private col: number;
	private value: number;

	//dom reference of tile - is set when Tile component is rendered
	public tileRef: React.RefObject<HTMLDivElement>;

	//flag used for animation when a new tile comes onto the board and when 2 tiles merge
	public firstTile = false;
	public tileMerged = false;

	constructor(row: number, col: number, value: number) {
		this.row = row;
		this.col = col;
		this.value = value;
		this.tileRef = createRef<HTMLDivElement>();
	}
	setValue(value: number) {
		this.value = value;
	}
	getValue(): number {
		return this.value;
	}
	getRow() {
		return this.row;
	}
	getCol() {
		return this.col;
	}

	isEmpty() {
		return this.value === 0;
	}

	slideTile(tileTo: Tile, mergeTiles: boolean): number {
		const prevVal = this.getValue();
		//clear this tile
		this.setValue(0);
		//set the tileTo value to this tile's value (or double if merging)
		tileTo.setValue(prevVal);
		let mergedVal = 0;
		if (mergeTiles) {
			mergedVal = prevVal * 2;
			tileTo.setValue(mergedVal);
			tileTo.tileMerged = true;
		}

		//return merge score
		return mergedVal;
	}

	isMerged() {
		return this.tileMerged;
	}

	isFirst() {
		return this.firstTile;
	}

	//generates a unique key for the tile
	getKey() {
		return Math.random().toString();
	}
}

export default Tile;
