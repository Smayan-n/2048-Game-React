import { useEffect, useRef, useState } from "react";
import "../styles/ControlSection.css";
interface ControlSectionProps {
	onGameStart: () => void;
	score: number;
	highScore: number;
	scoreDiff: number;
}

//custom hook to get previous value of a hook
// const usePreviousValue = (value: number) => {
// 	const ref = useRef<number>();
// 	useEffect(() => {
// 		ref.current = value;
// 	});
// 	return ref.current;
// };

function ControlSection(props: ControlSectionProps) {
	const { onGameStart, score, highScore, scoreDiff } = props;
	const [scoreAddVisible, setScoreAddVisible] = useState<boolean>(true);
	// const prevScore = usePreviousValue(score);

	useEffect(() => {
		setScoreAddVisible(true);
		setTimeout(() => {
			setScoreAddVisible(false);
		}, 300);
	}, [score]);

	return (
		<>
			<section className="control-section">
				<section className="title-section">
					<div className="title">2048</div>
					<div className="description">Merge tiles to get to 2048!</div>
				</section>
				<section className="right-section">
					<div className="display-section">
						<div className="score-div">
							Score
							<div className="score-text">{score === -1 ? 0 : score}</div>
							{scoreAddVisible && score > 0 ? <div className="score-add-div">+{scoreDiff}</div> : ""}
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
