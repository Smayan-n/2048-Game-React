import Tile from "./Tile";
import { Position, TileSlidePosition } from "./Utility";

class GameLogic {
	private setStateTiles: React.Dispatch<React.SetStateAction<Tile[] | undefined>>;
	private setGameEnded: React.Dispatch<React.SetStateAction<boolean>>;
	private tiles2d: Tile[][] | null;

	//score
	private score = 0;

	//slide animation speed - ms
	private animSpeed = 120;

	constructor(
		setTiles: React.Dispatch<React.SetStateAction<Tile[] | undefined>>,
		setGameEnded: React.Dispatch<React.SetStateAction<boolean>>
	) {
		//to set state from in here
		this.setStateTiles = setTiles;
		this.setGameEnded = setGameEnded;
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
		for (let r = 1; r < 5; r++) {
			for (let c = 1; c < 5; c++) {
				t2d[r - 1][c - 1] = new Tile(r, c, 0);
			}
		}
		this.tiles2d = t2d;
	}
	generateTiles() {
		//convert 2d array into 1d array
		return this.tiles2d?.flat();
	}

	#resetGame() {
		this.tiles2d?.forEach((row) => {
			row.forEach((tile) => {
				tile.setValue(0);
			});
		});
		this.score = 0;
		this.setGameEnded(false);
	}

	startGame() {
		// reset all tiles
		this.#resetGame();
		//add 2 tiles to start
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
			//to prevent game freeze from infinite loop
			searches++;
			if (searches > 10000) {
				return false;
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
		this.resetAnimationFlags();
	}

	resetAnimationFlags() {
		//reset firstTile and tileMerged
		setTimeout(() => {
			this.tiles2d?.forEach((row) => {
				row.forEach((tile) => {
					tile.firstTile = false;
					tile.tileMerged = false;
				});
			});
		}, this.animSpeed * 1.5);
	}

	slide(keyPress: string) {
		//TODO
		const slidePositions = this.getTileSlidePositions(keyPress);
		slidePositions.forEach((pos) => {
			this.#slideAnimation(pos.tile, pos.from, pos.to);
		});

		this.resetAnimationFlags();

		//return whether a new tile should be generated
		return slidePositions.length > 0;
	}

	#slideAnimation(tile: Tile, from: Position, to: Position) {
		const tileElement: HTMLDivElement | null = tile.tileRef.current;
		if (tileElement != null) {
			const style = tileElement.style;
			style.transition = (this.animSpeed / 1000).toString() + "s";

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
				style.gridRow = to.row.toString();
				style.gridColumn = to.col.toString();

				style.top = "0";
				style.left = "0";

				//to re-render
				// this.setStateTiles(this.generateTiles());
			}, this.animSpeed);
		}
	}

	getTileSlidePositions(direction: string): TileSlidePosition[] {
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
				const mergeScore = tile.slideTile(this.tiles2d![toPos.row - 1][toPos.col - 1], flag);
				this.score += mergeScore;
			}
		};

		//TODO: FIX hacked together flag thing
		switch (direction) {
			case "ArrowLeft":
				//loop columns from left to right
				for (let c = 1; c < 4; c++) {
					for (let r = 0; r < 4; r++) {
						const tile = this.tiles2d![r][c];
						if (!tile.isEmpty()) {
							let col = c - 1;
							while (col > 0 && this.tiles2d![r][col].isEmpty()) {
								col--;
							}
							let flag = false;
							if (!this.tiles2d![r][col].isEmpty()) {
								if (
									this.tiles2d![r][col].getValue() === tile.getValue() &&
									!this.tiles2d![r][col].isMerged()
								) {
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
						const tile = this.tiles2d![r][c];
						if (!tile.isEmpty()) {
							let col = c + 1;
							while (col < 3 && this.tiles2d![r][col].isEmpty()) {
								col++;
							}
							let flag = false;
							if (!this.tiles2d![r][col].isEmpty()) {
								if (
									this.tiles2d![r][col].getValue() === tile.getValue() &&
									!this.tiles2d![r][col].isMerged()
								) {
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
						const tile = this.tiles2d![r][c];
						if (!tile.isEmpty()) {
							let row = r - 1;
							while (row > 0 && this.tiles2d![row][c].isEmpty()) {
								row--;
							}
							let flag = false;
							if (!this.tiles2d![row][c].isEmpty()) {
								if (
									this.tiles2d![row][c].getValue() === tile.getValue() &&
									!this.tiles2d![row][c].isMerged()
								) {
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
						const tile = this.tiles2d![r][c];
						if (!tile.isEmpty()) {
							let row = r + 1;
							while (row < 3 && this.tiles2d![row][c].isEmpty()) {
								row++;
							}
							let flag = false;
							if (!this.tiles2d![row][c].isEmpty()) {
								if (
									this.tiles2d![row][c].getValue() === tile.getValue() &&
									!this.tiles2d![row][c].isMerged()
								) {
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
