export default function AboutScreen({ onBack }) {
  return (
    <div style={{ padding: '20px' }}>
      <h1>About</h1>

      <p>
        Yatze is a classic dice game where you roll 5 dice and try to fill in
        scoring categories for the highest possible total.
      </p>

      <p>
        This version supports both single-player practice and real-time
        multiplayer for 2 to 4 players. It is built with Next.js on the
        frontend, a Node.js WebSocket server for game logic and real-time
        communication, and SQLite for data persistence.
      </p>

      <p>
        Game state is saved automatically, so you can refresh the page and
        resume your game where you left off.
      </p>

      <button onClick={onBack} style={{ padding: '10px 20px', marginTop: '20px' }}>
        Back
      </button>
    </div>
  );
}
