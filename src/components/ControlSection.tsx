import "../styles/ControlSection.css";

interface ControlSectionProps {
	onGameStart: () => void;
	score: number;
	highScore: number;
}

function ControlSection(props: ControlSectionProps) {
	const { onGameStart, score, highScore } = props;

	return (
		<>
			<section className="control-section">
				<section className="title-section">2048</section>
				<section className="right-section">
					<div className="display-section">
						<div className="score-div">
							Score
							<div className="score-text">{score === -1 ? 0 : score}</div>
						</div>
						<div className="high-score-div">
							High Score
							<div className="score-text">{highScore}</div>
						</div>
					</div>
					<div className="button-section">
						<button onClick={onGameStart} className="start-btn">
							{score === -1 ? "Start Game" : "New Game"}
						</button>
					</div>
				</section>
			</section>
		</>
	);
}

export default ControlSection;
