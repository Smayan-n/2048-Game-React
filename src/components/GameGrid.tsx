import { useCallback, useEffect, useRef, useState } from "react";
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

interface GameEndVerification {
	ArrowUp: boolean;
	ArrowDown: boolean;
	ArrowLeft: boolean;
	ArrowRight: boolean;
}

function GameGrid(props: GameGridProps) {
	const { game, setGame, onScoreChange } = props;
	//state to update tiles on board
	const [tiles, setTiles] = useState<Tile[] | undefined>([]);
	const gameEndVerificationRef = useRef<GameEndVerification>({
		ArrowUp: false,
		ArrowDown: false,
		ArrowLeft: false,
		ArrowRight: false,
	});
	const [gameEnded, setGameEnded] = useState<boolean>(false);

	useEffect(() => {
		//setup game object
		setGame(new GameLogic(setTiles, setGameEnded));

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

						//reset game end verification
						gameEndVerificationRef.current = {
							ArrowDown: false,
							ArrowLeft: false,
							ArrowRight: false,
							ArrowUp: false,
						};
					} else {
						//check if game has ended
						const gameEndVerification = gameEndVerificationRef.current;
						gameEndVerification[direction] = true;
						if (Object.values(gameEndVerification).every((value) => value)) {
							//game has ended
							setGameEnded(true);
						}
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

	const handleGameRestart = () => {
		game?.startGame();
		onScoreChange(0);
		setGameEnded(false);
	};

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
				{/*render only if game has ended */}
				{gameEnded ? (
					<div className="game-over-screen">
						Game Over!
						<button onClick={handleGameRestart} className="restart-btn">
							Try Again
						</button>
					</div>
				) : (
					""
				)}
			</div>
		</>
	);
}

export default GameGrid;
