type VictoryBannerProps = {
  triesScore: number;
  timeScore: string;
  onReplay: () => void;
};

function VictoryBanner({
  triesScore,
  timeScore,
  onReplay,
}: VictoryBannerProps) {
  return (
    <section className="victory-banner" role="status" aria-live="polite">
      <h1 className="victory-text">Victoire !</h1>
      <div className="flex flex-row gap-5 p-5">
        <div className="victory-score">
          <h2>Temps</h2>
          <div>{timeScore}</div>
        </div>
        <div className="victory-score">
          <h2>Coups</h2>
          <div>{triesScore}</div>
        </div>
      </div>
      <button className="victory-button" onClick={onReplay}>
        Rejouer
      </button>
    </section>
  );
}

export default VictoryBanner;
