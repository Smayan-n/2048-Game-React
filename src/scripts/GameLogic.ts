import Tile from "./Tile";
import { Position, TileSlidePosition } from "./Utility";

class GameLogic {
	private tiles: Tile[] | undefined;
	private setStateTiles: React.Dispatch<React.SetStateAction<Tile[] | undefined>>;
	private tiles2d: Tile[][] | null;

	//score
	private score = 0;

	constructor(tiles: Tile[] | undefined, setTiles: React.Dispatch<React.SetStateAction<Tile[] | undefined>>) {
		this.tiles = tiles;
		//to set state from in here
		this.setStateTiles = setTiles;
		this.tiles2d = null;
		this.generate2DTiles();
	}

	getScore() {
		return this.score;
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
		//reset all tiles
		this.tiles?.forEach((tile) => {
			tile.setValue(0);
		});
		this.score = 0;
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
		const slidePositions = this.getTileSlidePositions(this.tiles2d!, keyPress);
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

	getTileSlidePositions(tiles: Tile[][], direction: string): TileSlidePosition[] {
		const tileSlidePositions: TileSlidePosition[] = [];

		const addPosition = (tile: Tile, toPos: Position, flag: boolean) => {
			const pos: TileSlidePosition = {
				tile: tile,
				from: { row: tile.getRow(), col: tile.getCol() },
				to: { row: toPos.row, col: toPos.col },
			};
			//if both to and from positions are equal, then dont add to tileSlidePositions
			if (pos.from.row !== pos.to.row || pos.from.col !== pos.to.col) {
				tileSlidePositions.push(pos);
				//update tile here itself so the next search will be successful
				//also update score
				const mergeScore = tile.slideTile(tiles[toPos.row - 1][toPos.col - 1], flag);
				this.score += mergeScore;
			}
		};

		//TODO: FIX hacked together flag thing
		switch (direction) {
			case "ArrowLeft":
				//loop columns from left to right
				for (let c = 1; c < 4; c++) {
					for (let r = 0; r < 4; r++) {
						const tile = tiles[r][c];
						if (!tile.isEmpty()) {
							let col = c - 1;
							while (col > 0 && tiles[r][col].isEmpty()) {
								col--;
							}
							let flag = false;
							if (!tiles[r][col].isEmpty()) {
								if (tiles[r][col].getValue() === tile.getValue()) {
									col--;
									flag = true;
								}
								col++;
							}
							addPosition(tile, { row: tile.getRow(), col: col + 1 }, flag);
						}
					}
				}
				break;

			case "ArrowRight":
				//loop columns from right to left
				for (let c = 2; c >= 0; c--) {
					for (let r = 3; r >= 0; r--) {
						const tile = tiles[r][c];
						if (!tile.isEmpty()) {
							let col = c + 1;
							while (col < 3 && tiles[r][col].isEmpty()) {
								col++;
							}
							let flag = false;
							if (!tiles[r][col].isEmpty()) {
								if (tiles[r][col].getValue() === tile.getValue()) {
									col++;
									flag = true;
								}
								col--;
							}
							addPosition(tile, { row: tile.getRow(), col: col + 1 }, flag);
						}
					}
				}
				break;

			case "ArrowUp":
				//loop rows from top to bottom
				for (let r = 1; r < 4; r++) {
					for (let c = 0; c < 4; c++) {
						const tile = tiles[r][c];
						if (!tile.isEmpty()) {
							let row = r - 1;
							while (row > 0 && tiles[row][c].isEmpty()) {
								row--;
							}
							let flag = false;
							if (!tiles[row][c].isEmpty()) {
								if (tiles[row][c].getValue() === tile.getValue()) {
									row--;
									flag = true;
								}
								row++;
							}
							addPosition(tile, { row: row + 1, col: tile.getCol() }, flag);
						}
					}
				}
				break;

			case "ArrowDown":
				//loop rows from bottom to top
				for (let r = 2; r >= 0; r--) {
					for (let c = 3; c >= 0; c--) {
						const tile = tiles[r][c];
						if (!tile.isEmpty()) {
							let row = r + 1;
							while (row < 3 && tiles[row][c].isEmpty()) {
								row++;
							}
							let flag = false;
							if (!tiles[row][c].isEmpty()) {
								if (tiles[row][c].getValue() === tile.getValue()) {
									row++;
									flag = true;
								}
								row--;
							}
							addPosition(tile, { row: row + 1, col: tile.getCol() }, flag);
						}
					}
				}
				break;

			default:
				break;
		}

		return tileSlidePositions;
	}

	//returns rand row/col index between 1 and 4 inclusive
	randIdx() {
		return Math.floor(Math.random() * 4) + 1;
	}
}

export default GameLogic;
