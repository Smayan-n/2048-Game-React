import Tile from "../scripts/Tile";
import "../styles/GameTile.css";

interface GameTileProps {
	tile: Tile;
}

// const usePreviousValue = (value: number) => {
// 	const ref = useRef<number>();
// 	useEffect(() => {
// 		ref.current = value;
// 	});
// 	return ref.current;
// };

function GameTile(props: GameTileProps) {
	const { tile } = props;
	const [row, col, value] = [tile.getRow(), tile.getCol(), tile.getValue()];

	// const prevValue = usePreviousValue(value);

	//for color of tile based on value
	const tileColorMap: { [key: number]: string } = {
		2: "#EEE4DA",
		4: "#EDE0C8",
		8: "#F2B179",
		16: "#F59563",
		32: "#F67C5F",
		64: "#F65E3B",
		128: "#EDCF72",
		256: "#EDCC61",
		512: "#EDC850",
		1024: "#EDC53F",
		2048: "#EDC22E",
		4096: "#3C3A32",
		8192: "#BB8D00",
		16384: "#C18300",
		32768: "#C77A00",
		65536: "#CD7000",
		// Add more tiles and colors as needed
	};

	//render tile only if value is not 0
	return (
		<>
			{value === 0 ? null : (
				<div
					ref={tile.tileRef}
					className={`game-tile ${tile.isFirst() ? "grow-anim" : ""} ${tile.isMerged() ? "pop-anim" : ""}`}
					style={{
						gridRow: row,
						gridColumn: col,
						backgroundColor: tileColorMap[value],
						color: value < 32 ? "#776e65" : "white",
					}}
				>
					{value}
				</div>
			)}
		</>
	);
}

export default GameTile;
