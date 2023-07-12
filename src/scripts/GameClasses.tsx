import { createRef } from "react";
import { Position, getTileSlidePositions } from "./Utility";

class GameLogic {
	private tiles: Tile[] | undefined;
	private setStateTiles: React.Dispatch<React.SetStateAction<Tile[] | undefined>>;
	private tiles2d: Tile[][] | null;

	//score

	constructor(tiles: Tile[] | undefined, setTiles: React.Dispatch<React.SetStateAction<Tile[] | undefined>>) {
		this.tiles = tiles;
		//to set state from in here
		this.setStateTiles = setTiles;
		this.tiles2d = null;
		this.generate2DTiles();
	}

	generate2DTiles() {
		const t2d: Tile[][] = [
			[new Tile(0, 0, 0), new Tile(0, 0, 0), new Tile(0, 0, 0), new Tile(0, 0, 0)],
			[new Tile(0, 0, 0), new Tile(0, 0, 0), new Tile(0, 0, 0), new Tile(0, 0, 0)],
			[new Tile(0, 0, 0), new Tile(0, 0, 0), new Tile(0, 0, 0), new Tile(0, 0, 0)],
			[new Tile(0, 0, 0), new Tile(0, 0, 0), new Tile(0, 0, 0), new Tile(0, 0, 0)],
		];
		this.tiles?.forEach((tile) => {
			//! is for null check
			t2d[tile.getRow() - 1][tile.getCol() - 1] = tile;
		});
		this.tiles2d = t2d;
	}
	generateTiles() {
		//convert 2d array into 1d array
		this.tiles = this.tiles2d?.flat();
		return this.tiles;
	}

	startGame() {
		this.addNewTile();
		this.addNewTile();
	}

	addNewTile() {
		//adds new tile when game is running that does not overlap with existing tiles
		let r = this.randIdx();
		let c = this.randIdx();
		let searches = 0;
		while (!this.tiles2d![r - 1][c - 1].isEmpty()) {
			r = this.randIdx();
			c = this.randIdx();
			//to prevent infinite loop when no empty tiles are left
			//TODO - can be used to detect if game is over
			searches++;
			if (searches >= 16) {
				return;
			}
		}
		//RULE: 10% of the time, a new tile can be a 4
		const prob = Math.random();
		let newValue = 2;
		if (prob <= 0.1) {
			newValue = 4;
		}
		this.tiles2d![r - 1][c - 1].setValue(newValue);
		this.tiles2d![r - 1][c - 1].firstTile = true;
		this.setStateTiles(this.generateTiles());
	}

	slide(keyPress: string) {
		//TODO
		const slidePositions = getTileSlidePositions(this.tiles2d!, keyPress);
		slidePositions.forEach((pos) => {
			this.#slideAnimation(pos.tile, pos.from, pos.to);
		});

		this.setStateTiles(this.tiles);

		//return whether a new tile should be generated
		return slidePositions.length > 0;
	}

	#slideAnimation(tile: Tile, from: Position, to: Position) {
		const tileElement: HTMLDivElement | null = tile.tileRef.current;
		if (tileElement != null) {
			const style = tileElement.style;
			style.transition = "0.1s";

			const { top: top1, left: left1 } = tileElement.getBoundingClientRect();

			//final pos
			style.gridRow = to.row.toString();
			style.gridColumn = to.col.toString();
			const { top: top2, left: left2 } = tileElement.getBoundingClientRect();

			//initial pos
			style.gridRow = from.row.toString();
			style.gridColumn = from.col.toString();
			//set left and top position for animation
			style.left = (left2 - left1).toString() + "px";
			style.top = (top2 - top1).toString() + "px";

			//after animation update to right coordinates
			setTimeout(() => {
				style.transition = "auto";

				style.top = "0";
				style.left = "0";

				//to re-render
				this.setStateTiles(this.generateTiles());
			}, 100);
		}
	}

	//returns rand row/col index between 1 and 4 inclusive
	randIdx() {
		return Math.floor(Math.random() * 4) + 1;
	}
}
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

	slideTile(tileTo: Tile, mergeTiles: boolean) {
		const prevVal = this.getValue();
		//clear this tile
		this.setValue(0);
		//set the tileTo value to this tile's value (or double if merging)
		tileTo.setValue(prevVal);
		if (mergeTiles) {
			tileTo.setValue(prevVal + tileTo.getValue());
			tileTo.tileMerged = true;
		}
	}

	isMerged() {
		const val = this.tileMerged;
		//set tileMerged to false after 300ms to avoid animation issues
		setTimeout(() => {
			this.tileMerged = false;
		}, 300);
		return val;
	}

	isFirst() {
		const val = this.firstTile;
		setTimeout(() => {
			this.firstTile = false;
		}, 300);
		return val;
	}

	//generates a unique key for the tile using row and col
	getKey() {
		return Math.random().toString();
	}
}

export { GameLogic, Tile };
