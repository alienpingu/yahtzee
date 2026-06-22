export const CATEGORIES = [
  'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
  'threeOfKind', 'fourOfKind', 'fullHouse', 'smallStraight',
  'largeStraight', 'yatze', 'chance',
];

export class Game {
  constructor() {
    this.id = null;
    this.code = null;
    this.status = 'waiting';
    this.hostPlayerId = null;
    this.currentTurnPlayerId = null;
    this.currentTurnSeat = null;
    this.winnerPlayerId = null;
    this.round = 1;
    this.dice = [0, 0, 0, 0, 0];
    this.rollsLeft = 3;
    this.players = [];
  }

  static create(id, code, hostPlayer) {
    const g = new Game();
    g.id = id;
    g.code = code;
    g.hostPlayerId = hostPlayer.id;
    g.addPlayer(hostPlayer);
    return g;
  }

  addPlayer(player) {
    if (this.status !== 'waiting') throw new Error('Game already started');
    if (this.players.length >= 4) throw new Error('Game is full');
    if (this.players.some((p) => p.playerId === player.id)) throw new Error('Already in game');
    const seat = this.players.length + 1;
    this.players.push({
      playerId: player.id,
      name: player.name,
      seat,
      scorecard: {},
      totalScore: 0,
    });
    return seat;
  }

  start(playerId) {
    if (playerId !== this.hostPlayerId) throw new Error('Only host can start');
    if (this.status !== 'waiting') throw new Error('Game already started');
    if (this.players.length < 1) throw new Error('No players');
    this.players.sort((a, b) => a.seat - b.seat);
    this.status = 'in_progress';
    this.round = 1;
    this.rollsLeft = 3;
    this.dice = [0, 0, 0, 0, 0];
    this.currentTurnSeat = this.players[0].seat;
    this.currentTurnPlayerId = this.players[0].playerId;
  }

  roll(playerId, keep = []) {
    this.assertTurn(playerId);
    if (this.rollsLeft <= 0) throw new Error('No rolls left');
    for (let i = 0; i < 5; i++) {
      if (!keep.includes(i)) this.dice[i] = Math.floor(Math.random() * 6) + 1;
    }
    this.rollsLeft--;
  }

  score(playerId, category) {
    this.assertTurn(playerId);
    const p = this.players.find((p) => p.playerId === playerId);
    if (!p) throw new Error('Player not in game');
    if (!CATEGORIES.includes(category)) throw new Error('Invalid category');
    if (p.scorecard[category] !== undefined) throw new Error('Category already scored');

    const points = calculateScore(category, this.dice);
    p.scorecard[category] = points;
    p.totalScore += points;
    this.rollsLeft = 3;
    this.dice = [0, 0, 0, 0, 0];

    if (this.isComplete()) {
      this.complete();
    } else {
      this.rotateTurn();
    }
  }

  rotateTurn() {
    const seats = this.players.map((p) => p.seat).sort((a, b) => a - b);
    const idx = seats.indexOf(this.currentTurnSeat);
    const nextIdx = (idx + 1) % seats.length;
    if (nextIdx === 0) this.round++;
    this.currentTurnSeat = seats[nextIdx];
    this.currentTurnPlayerId = this.players.find((p) => p.seat === this.currentTurnSeat).playerId;
  }

  isComplete() {
    return this.players.every((p) => Object.keys(p.scorecard).length >= CATEGORIES.length);
  }

  complete() {
    this.status = 'completed';
    let best = null;
    for (const p of this.players) {
      if (!best || p.totalScore > best.totalScore) best = p;
    }
    this.winnerPlayerId = best ? best.playerId : null;
  }

  assertTurn(playerId) {
    if (this.status !== 'in_progress') throw new Error('Game not in progress');
    if (this.currentTurnPlayerId !== playerId) throw new Error('Not your turn');
  }

  toState() {
    return {
      id: this.id,
      code: this.code,
      status: this.status,
      hostPlayerId: this.hostPlayerId,
      currentTurnPlayerId: this.currentTurnPlayerId,
      winnerPlayerId: this.winnerPlayerId,
      round: this.round,
      dice: this.dice,
      rollsLeft: this.rollsLeft,
      players: this.players.map((p) => ({
        playerId: p.playerId,
        name: p.name,
        seat: p.seat,
        scorecard: { ...p.scorecard },
        totalScore: p.totalScore,
      })),
    };
  }

  static hydrate(data) {
    const g = new Game();
    Object.assign(g, data);
    g.dice = Array.isArray(data.dice) ? [...data.dice] : [0, 0, 0, 0, 0];
    g.players = (data.players || []).map((p) => ({ ...p, scorecard: { ...(p.scorecard || {}) } }));
    const cur = g.players.find((p) => p.playerId === g.currentTurnPlayerId);
    g.currentTurnSeat = cur ? cur.seat : null;
    return g;
  }
}

function calculateScore(category, dice) {
  const counts = dice.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

  const sum = dice.reduce((a, b) => a + b, 0);
  const sorted = Object.values(counts).sort((a, b) => b - a);

  switch (category) {
    case 'ones': return counts[1] ? counts[1] * 1 : 0;
    case 'twos': return counts[2] ? counts[2] * 2 : 0;
    case 'threes': return counts[3] ? counts[3] * 3 : 0;
    case 'fours': return counts[4] ? counts[4] * 4 : 0;
    case 'fives': return counts[5] ? counts[5] * 5 : 0;
    case 'sixes': return counts[6] ? counts[6] * 6 : 0;
    case 'threeOfKind': return sorted[0] >= 3 ? sum : 0;
    case 'fourOfKind': return sorted[0] >= 4 ? sum : 0;
    case 'fullHouse': return sorted[0] === 3 && sorted[1] === 2 ? 25 : 0;
    case 'smallStraight': {
      const s = [1, 2, 3, 4].every((n) => counts[n]) || [2, 3, 4, 5].every((n) => counts[n]) || [3, 4, 5, 6].every((n) => counts[n]);
      return s ? 30 : 0;
    }
    case 'largeStraight': {
      const s = [1, 2, 3, 4, 5].every((n) => counts[n]) || [2, 3, 4, 5, 6].every((n) => counts[n]);
      return s ? 40 : 0;
    }
    case 'yatze': return sorted[0] === 5 ? 50 : 0;
    case 'chance': return sum;
    default: return 0;
  }
}
