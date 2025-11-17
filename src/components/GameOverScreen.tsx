import { Player } from '../types';
import { ScoringEngine } from '../engines/ScoringEngine';
import './GameOverScreen.css';

interface GameOverScreenProps {
  isOpen: boolean;
  players: Player[];
  onNewGame: () => void;
}

/**
 * GameOverScreen component - Display final game results
 * Requirements: 5.5, 8.5
 */
export function GameOverScreen({ isOpen, players, onNewGame }: GameOverScreenProps) {
  if (!isOpen) return null;

  // Determine the overall winner (lowest cumulative score)
  const winner = ScoringEngine.determineWinner(players);

  // Sort players by cumulative score (ascending)
  const sortedPlayers = [...players].sort((a, b) => a.cumulativeScore - b.cumulativeScore);

  // Get round-by-round scores for display
  const maxRounds = Math.max(...players.map(p => p.roundScores.length));

  return (
    <div className="game-over-screen-overlay">
      <div className="game-over-screen">
        <div className="game-over-header">
          <h1>Game Over!</h1>
          <div className="confetti">🎉 🎊 🎉 🎊 🎉</div>
        </div>

        <div className="game-over-content">
          {/* Winner Announcement */}
          <div className="winner-section">
            <div className="winner-trophy">👑</div>
            <h2 className="winner-title">Champion</h2>
            <h3 className="winner-name">{winner.name}</h3>
            <div className="winner-stats">
              <div className="stat-item">
                <span className="stat-label">Final Score</span>
                <span className="stat-value">{winner.cumulativeScore}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Player Type</span>
                <span className="stat-value">{winner.type}</span>
              </div>
            </div>
            <p className="winner-message">
              Congratulations! You've won with the lowest score!
            </p>
          </div>

          {/* Final Standings */}
          <div className="final-standings">
            <h3>Final Standings</h3>
            <div className="standings-table">
              <div className="standings-header">
                <div className="col-position">Rank</div>
                <div className="col-player">Player</div>
                <div className="col-type">Type</div>
                <div className="col-score">Final Score</div>
              </div>

              {sortedPlayers.map((player, index) => {
                const isWinner = player.id === winner.id;
                const medals = ['🥇', '🥈', '🥉'];
                const medal = index < 3 ? medals[index] : '';

                return (
                  <div
                    key={player.id}
                    className={`standings-row ${isWinner ? 'winner-row' : ''}`}
                  >
                    <div className="col-position">
                      <span className={`position-badge ${isWinner ? 'winner' : ''}`}>
                        {medal} {index + 1}
                      </span>
                    </div>
                    <div className="col-player">
                      <span className="player-name">{player.name}</span>
                    </div>
                    <div className="col-type">
                      <span className="type-badge">{player.type}</span>
                    </div>
                    <div className="col-score">
                      <span className="score-value">{player.cumulativeScore}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Round-by-Round Breakdown */}
          <div className="round-breakdown">
            <h3>Round-by-Round Score Breakdown</h3>
            <div className="breakdown-table-wrapper">
              <table className="breakdown-table">
                <thead>
                  <tr>
                    <th className="player-col">Player</th>
                    {Array.from({ length: maxRounds }, (_, i) => (
                      <th key={i} className="round-col">R{i + 1}</th>
                    ))}
                    <th className="total-col">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPlayers.map(player => (
                    <tr key={player.id} className={player.id === winner.id ? 'winner-row' : ''}>
                      <td className="player-col">
                        <span className="player-name">{player.name}</span>
                      </td>
                      {Array.from({ length: maxRounds }, (_, i) => (
                        <td key={i} className="round-col">
                          <span className={`round-score ${player.roundScores[i] === 0 ? 'zero-score' : ''}`}>
                            {player.roundScores[i] !== undefined ? player.roundScores[i] : '-'}
                          </span>
                        </td>
                      ))}
                      <td className="total-col">
                        <span className="total-score">{player.cumulativeScore}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Game Statistics */}
          <div className="game-statistics">
            <h3>Game Statistics</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🎮</div>
                <div className="stat-content">
                  <span className="stat-number">{maxRounds}</span>
                  <span className="stat-description">Rounds Played</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <span className="stat-number">{players.length}</span>
                  <span className="stat-description">Players</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-content">
                  <span className="stat-number">{winner.cumulativeScore}</span>
                  <span className="stat-description">Winning Score</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <span className="stat-number">
                    {Math.max(...players.map(p => p.cumulativeScore))}
                  </span>
                  <span className="stat-description">Highest Score</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="game-over-footer">
          <button className="new-game-btn" onClick={onNewGame}>
            <span className="btn-icon">🎴</span>
            <span>Start New Game</span>
          </button>
        </div>
      </div>
    </div>
  );
}
