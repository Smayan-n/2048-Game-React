import { Tile } from "./GameClasses";

interface Position {
	row: number;
	col: number;
}

//to and from start from index 1 and not 0
interface TileSlidePosition {
	tile: Tile;
	from: Position;
	to: Position;
}

function getTileSlidePositions(tiles: Tile[][], direction: string): TileSlidePosition[] {
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
			tile.slideTile(tiles[toPos.row - 1][toPos.col - 1], flag);
		}
	};

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

export { Position, Tile, TileSlidePosition, getTileSlidePositions };
