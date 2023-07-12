import "../styles/ControlSection.css";

interface ControlSectionProps {
	onGameStart: () => void;
}

function ControlSection(props: ControlSectionProps) {
	const { onGameStart } = props;

	return (
		<>
			<section className="control-section">
				<section className="title-section">2048</section>
				<section className="right-section">
					<div className="display-section">
						<div className="score-div">
							Score
							<div className="score-text">22</div>
						</div>
						<div className="high-score-div">
							High Score
							<div className="score-text">22</div>
						</div>
					</div>
					<div className="button-section">
						<button onClick={onGameStart} className="start-btn">
							Start Game
						</button>
					</div>
				</section>
			</section>
		</>
	);
}

export default ControlSection;
