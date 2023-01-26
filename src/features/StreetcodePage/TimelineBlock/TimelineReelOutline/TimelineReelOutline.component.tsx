import './TimelineReelOutline.styles.scss';

const TimelineReelOutline = () => (
    <div className="timelineSquareContainer">
        {Array(24).fill(0).map((_, idx) => (
            <div key={idx} className="timelineSquare" />
        ))}
    </div>
);

export default TimelineReelOutline;
