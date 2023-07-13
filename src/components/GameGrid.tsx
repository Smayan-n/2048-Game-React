import { useCallback, useEffect, useState } from "react";
import GameLogic from "../scripts/GameLogic";
import Tile from "../scripts/Tile";
import "../styles/GameGrid.css";
import GameTile from "./GameTile";
import useSwipe from "./useSwipe";

interface GameGridProps {
	game: GameLogic | null;
	setGame: (game: GameLogic) => void;
	onScoreChange: (newScore: number) => void;
}

function GameGrid(props: GameGridProps) {
	const { game, setGame, onScoreChange } = props;
	//state to update tiles on board
	const [tiles, setTiles] = useState<Tile[] | undefined>([]);

	useEffect(() => {
		//setup game object
		setGame(new GameLogic(setTiles));

		//cleanup
		return () => {
			setTiles([]);
		};
	}, [setGame]);

	const handleMove = useCallback(
		(direction: string) => {
			if (
				direction === "ArrowUp" ||
				direction === "ArrowDown" ||
				direction === "ArrowLeft" ||
				direction === "ArrowRight"
			) {
				const generateNew = game?.slide(direction);
				// generate new tile - should only generate when at least 1 tile has moved
				setTimeout(() => {
					if (generateNew) {
						game?.addNewTile();
						//update score each time a tile is moved
						//if .getScore() results in a falsy value, 0 will be used instead
						onScoreChange(game?.getScore() || 0);
					}
				}, 100 * 1.5);
			}
		},
		[game, onScoreChange]
	);

	//handle keyboard key press
	//TODO: prevent key hold
	const handleKeyPress = useCallback(
		(event: KeyboardEvent) => {
			handleMove(event.key);
		},
		[handleMove]
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyPress, true);
		//cleanup
		return () => {
			document.removeEventListener("keydown", handleKeyPress, true);
		};
	}, [handleKeyPress]);

	//--------------------------------------------------------------------------------
	const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe(handleMove);

	return (
		<>
			<div className="game-grid" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
				<div className="grid-cell"></div>
				<div className="grid-cell"></div>
				<div className="grid-cell"></div>
				<div className="grid-cell"></div>
				<div className="grid-cell"></div>
				<div className="grid-cell"></div>
				<div className="grid-cell"></div>
				<div className="grid-cell"></div>
				<div className="grid-cell"></div>
				<div className="grid-cell"></div>
				<div className="grid-cell"></div>
				<div className="grid-cell"></div>
				<div className="grid-cell"></div>
				<div className="grid-cell"></div>
				<div className="grid-cell"></div>
				<div className="grid-cell"></div>

				<div className="tile-grid">
					{/*render only if value is not 0 */}
					{tiles?.map((tile) => {
						return tile.getValue() === 0 ? "" : <GameTile key={tile.getKey()} tile={tile} />;
					})}
				</div>
			</div>
		</>
	);
}

export default GameGrid;
