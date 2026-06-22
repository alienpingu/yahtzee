export default function RulesScreen({ onBack }) {
  return (
    <div style={{ padding: '20px' }}>
      <h1>How to Play</h1>

      <h2>Gameplay</h2>
      <ol>
        <li>Click "Roll Dice" to roll all 5 dice.</li>
        <li>Click on dice to keep them (blue border).</li>
        <li>Roll again (up to 3 times total per turn).</li>
        <li>Choose a scoring category to end your turn.</li>
        <li>Complete all 13 categories to finish the game.</li>
      </ol>

      <h2>Scoring Categories</h2>
      <ul>
        <li><strong>Ones through Sixes</strong>: Sum of matching dice.</li>
        <li><strong>Three of a Kind</strong>: Sum of all dice if 3+ match.</li>
        <li><strong>Four of a Kind</strong>: Sum of all dice if 4+ match.</li>
        <li><strong>Full House</strong>: 25 points (3 of one + 2 of another).</li>
        <li><strong>Small Straight</strong>: 30 points (4 consecutive).</li>
        <li><strong>Large Straight</strong>: 40 points (5 consecutive).</li>
        <li><strong>Yatze</strong>: 50 points (all 5 dice the same).</li>
        <li><strong>Chance</strong>: Sum of all dice.</li>
      </ul>

      <h2>Multiplayer</h2>
      <ul>
        <li>Create a game and share the 4-character code with friends.</li>
        <li>2 to 4 players per game.</li>
        <li>Players take turns in strict order.</li>
        <li>Highest total score after 13 rounds wins.</li>
      </ul>

      <button onClick={onBack} style={{ padding: '10px 20px', marginTop: '20px' }}>
        Back
      </button>
    </div>
  );
}
