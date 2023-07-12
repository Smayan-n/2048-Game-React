import { useEffect, useState } from "react";
import "./App.css";
import ControlSection from "./components/ControlSection";
import GameGrid from "./components/GameGrid";
import GameLogic from "./scripts/GameLogic";

function App() {
	const [game, setGame] = useState<GameLogic | null>(null);
	const [score, setScore] = useState<number>(-1);
	const [highScore, setHighScore] = useState<number>(0);

	//for storage and retrieval of high score
	useEffect(() => {
		//load highscore from local storage
		const highScore = localStorage.getItem("highScore");
		setHighScore(highScore ? parseInt(highScore) : 0);
	}, []);

	useEffect(() => {
		//store highscore in local storage
		if (highScore > 0) {
			localStorage.setItem("highScore", highScore.toString());
		}
	}, [highScore]);

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

	const handleScoreChange = (newScore: number) => {
		setScore(newScore);
		//update high score if new score is higher
		if (newScore > highScore) {
			setHighScore(newScore);
		}
	};

	const handleGameStart = () => {
		game?.startGame();
		handleScoreChange(0);
	};

	return (
		<>
			<section className="game-grid-section">
				<ControlSection onGameStart={handleGameStart} score={score} highScore={highScore} />
				<GameGrid game={game} setGame={setGame} onScoreChange={handleScoreChange} />
			</section>
		</>
	);
}

export default App;
