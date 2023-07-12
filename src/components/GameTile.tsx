import { Tile } from "../scripts/Utility";
import "../styles/GameTile.css";

interface GameTileProps {
	tile: Tile;
}

function GameTile(props: GameTileProps) {
	const { tile } = props;
	const [row, col, value] = [tile.getRow(), tile.getCol(), tile.getValue()];

	//for color of tile based on value
	const tileColorMap: { [key: number]: string } = {
		2: "#893d3c",
		4: "orange",
		8: "green",
		16: "blue",
		32: "purple",
		64: "red",
		128: "yellow",
		256: "brown",
		512: "pink",
		1024: "black",
		2048: "white",
	};
	//render tile only if value is not 0
	return (
		<>
			{value === 0 ? null : (
				<div
					ref={tile.tileRef}
					className={`game-tile ${tile.isFirst() ? "grow-anim" : ""} ${tile.isMerged() ? "pop-anim" : ""}`}
					style={{ gridRow: row, gridColumn: col, backgroundColor: tileColorMap[value] }}
				>
					{value}
				</div>
			)}
		</>
	);
}

export default GameTile;
