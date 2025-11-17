import { Player } from '../types';
import './ScoreBoard.css';
import './VisualFeedback.css';

interface ScoreBoardProps {
  players: Player[];
  currentPlayerId: string;
  round: number;
}

/**
 * ScoreBoard component - Display all players' scores and status
 * Requirements: 8.1, 8.3, 8.4, 13.5
 */
export function ScoreBoard({ players, currentPlayerId, round }: ScoreBoardProps) {
  // Sort players by cumulative score (lowest first)
  const sortedPlayers = [...players].sort((a, b) => a.cumulativeScore - b.cumulativeScore);

  return (
    <div className="scoreboard">
      <h3 className="scoreboard-title">Scoreboard</h3>
      <div className="scoreboard-round">Round {round} of 7</div>
      
      <div className="players-list">
        {sortedPlayers.map((player, index) => {
          const isCurrentPlayer = player.id === currentPlayerId;
          const isLeading = index === 0 && player.cumulativeScore < sortedPlayers[1]?.cumulativeScore;
          
          return (
            <div 
              key={player.id} 
              className={`player-row ${isCurrentPlayer ? 'current-player player-current' : ''} ${isLeading ? 'leading' : ''}`}
            >
              <div className="player-info-section">
                <div className="player-name-row">
                  <span className="player-name">
                    {player.name}
                    {player.type === 'AI' && <span className="ai-badge">AI</span>}
                  </span>
                  {isCurrentPlayer && <span className="current-badge">▶</span>}
                  {isLeading && <span className="leader-badge">👑</span>}
                </div>
                
                <div className="player-status">
                  {player.hasMelded ? (
                    <span className="status-melded">✓ Melded</span>
                  ) : (
                    <span className="status-not-melded">Not Melded</span>
                  )}
                </div>
              </div>
              
              <div className="player-stats">
                <div className="stat-item">
                  <span className="stat-label">Buys</span>
                  <span className="stat-value">{player.buysRemaining}/3</span>
                </div>
                
                <div className="stat-item">
                  <span className="stat-label">Round</span>
                  <span className="stat-value">
                    {player.roundScores.length > 0 
                      ? player.roundScores[player.roundScores.length - 1] 
                      : '-'}
                  </span>
                </div>
                
                <div className="stat-item total-score">
                  <span className="stat-label">Total</span>
                  <span className="stat-value">{player.cumulativeScore}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="scoreboard-footer">
        <div className="scoring-info">
          <div className="info-title">Scoring:</div>
          <div className="info-text">2-10: Face value</div>
          <div className="info-text">J/Q/K: 10 pts</div>
          <div className="info-text">Ace: 15 pts</div>
          <div className="info-text">Joker: 50 pts</div>
        </div>
      </div>
    </div>
  );
}
