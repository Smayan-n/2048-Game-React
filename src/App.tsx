import { useEffect, useState } from "react";
import "./App.css";
import ControlSection from "./components/ControlSection";
import GameGrid from "./components/GameGrid";
import { GameLogic } from "./scripts/GameClasses";

function App() {
	const [game, setGame] = useState<GameLogic | null>(null);

	//to prevent scrolling on arrow key press
	useEffect(() => {
		window.addEventListener("keydown", preventArrowScroll, false);

		function preventArrowScroll(e: KeyboardEvent) {
			if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
				e.preventDefault();
			}
		}

		//cleanup
		return () => {
			window.removeEventListener("keydown", preventArrowScroll, false);
		};
	});

	const handleGameStart = () => {
		game?.startGame();
	};

	return (
		<>
			<section className="game-grid-section">
				<ControlSection onGameStart={handleGameStart} />
				<GameGrid game={game} setGame={setGame} />
			</section>
		</>
	);
}

export default App;
