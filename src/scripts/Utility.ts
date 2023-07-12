import Tile from "./Tile";

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

export { Position, TileSlidePosition };
