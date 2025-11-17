import { Player } from '../types';
import { ScoringEngine } from '../engines/ScoringEngine';
import { CardComponent } from './CardComponent';
import './RoundEndDialog.css';

interface RoundEndDialogProps {
  isOpen: boolean;
  round: number;
  players: Player[];
  winnerPlayerId: string;
  onNextRound: () => void;
}

/**
 * RoundEndDialog component - Display round results and scores
 * Requirements: 5.2, 8.2, 8.3, 8.4, 14.3, 14.5
 */
export function RoundEndDialog({
  isOpen,
  round,
  players,
  winnerPlayerId,
  onNextRound
}: RoundEndDialogProps) {
  if (!isOpen) return null;

  const winner = players.find(p => p.id === winnerPlayerId);
  
  // Calculate round scores for all players
  const roundScores = ScoringEngine.calculateRoundScores(players, winnerPlayerId);

  // Sort players by round score (winner first, then by score ascending)
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.id === winnerPlayerId) return -1;
    if (b.id === winnerPlayerId) return 1;
    const scoreA = roundScores.get(a.id) || 0;
    const scoreB = roundScores.get(b.id) || 0;
    return scoreA - scoreB;
  });

  return (
    <div className="round-end-dialog-overlay">
      <div className="round-end-dialog">
        <div className="round-end-dialog-header">
          <h2>Round {round} Complete!</h2>
        </div>

        <div className="round-end-dialog-content">
          {/* Winner Announcement */}
          <div className="winner-announcement">
            <div className="trophy-icon">🏆</div>
            <h3>{winner?.name} Wins Round {round}!</h3>
            <p className="winner-subtitle">Successfully went out with 0 points</p>
          </div>

          {/* Player Results */}
          <div className="player-results">
            <h3>Round {round} Results:</h3>
            <div className="results-table">
              <div className="results-header">
                <div className="col-rank">Rank</div>
                <div className="col-player">Player</div>
                <div className="col-hand">Remaining Cards</div>
                <div className="col-round-score">Round Score</div>
                <div className="col-cumulative">Total Score</div>
              </div>

              {sortedPlayers.map((player, index) => {
                const roundScore = roundScores.get(player.id) || 0;
                const isWinner = player.id === winnerPlayerId;

                return (
                  <div
                    key={player.id}
                    className={`results-row ${isWinner ? 'winner-row' : ''}`}
                  >
                    <div className="col-rank">
                      {index === 0 ? (
                        <span className="rank-badge winner">1st</span>
                      ) : (
                        <span className="rank-badge">{index + 1}</span>
                      )}
                    </div>

                    <div className="col-player">
                      <span className="player-name">{player.name}</span>
                      {player.type === 'AI' && (
                        <span className="player-badge">AI</span>
                      )}
                    </div>

                    <div className="col-hand">
                      {isWinner ? (
                        <span className="went-out-badge">Went Out!</span>
                      ) : (
                        <div className="hand-preview">
                          {player.hand.slice(0, 5).map(card => (
                            <CardComponent key={card.id} card={card} size="small" />
                          ))}
                          {player.hand.length > 5 && (
                            <span className="more-cards">+{player.hand.length - 5}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="col-round-score">
                      <span className={`score-value ${isWinner ? 'winner-score' : ''}`}>
                        {roundScore}
                      </span>
                    </div>

                    <div className="col-cumulative">
                      <span className="cumulative-score">
                        {player.cumulativeScore + roundScore}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="score-breakdown">
            <h4>Score Calculation:</h4>
            <ul>
              <li>Winner ({winner?.name}): 0 points (went out)</li>
              {sortedPlayers
                .filter(p => p.id !== winnerPlayerId)
                .map(player => {
                  const score = roundScores.get(player.id) || 0;
                  return (
                    <li key={player.id}>
                      {player.name}: {score} points ({player.hand.length} cards remaining)
                    </li>
                  );
                })}
            </ul>
          </div>

          {/* Current Standings */}
          <div className="current-standings">
            <h4>Current Standings After Round {round}:</h4>
            <div className="standings-list">
              {[...players]
                .sort((a, b) => {
                  const scoreA = a.cumulativeScore + (roundScores.get(a.id) || 0);
                  const scoreB = b.cumulativeScore + (roundScores.get(b.id) || 0);
                  return scoreA - scoreB;
                })
                .map((player, index) => {
                  const totalScore = player.cumulativeScore + (roundScores.get(player.id) || 0);
                  return (
                    <div key={player.id} className="standing-item">
                      <span className="standing-position">{index + 1}.</span>
                      <span className="standing-name">{player.name}</span>
                      <span className="standing-score">{totalScore} pts</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <div className="round-end-dialog-footer">
          <button className="next-round-btn" onClick={onNextRound}>
            {round < 7 ? `Continue to Round ${round + 1}` : 'View Final Results'}
          </button>
        </div>
      </div>
    </div>
  );
}
