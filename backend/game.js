export class Game {
  constructor() {
    this.reset();
  }

  reset() {
    this.dice = [0, 0, 0, 0, 0];
    this.rollsLeft = 3;
    this.scores = {};
    this.currentRound = 1;
    this.totalScore = 0;
  }

  rollDice(keep = []) {
    if (this.rollsLeft <= 0) return;
    
    for (let i = 0; i < 5; i++) {
      if (!keep.includes(i)) {
        this.dice[i] = Math.floor(Math.random() * 6) + 1;
      }
    }
    this.rollsLeft--;
  }

  score(category) {
    if (this.scores[category] !== undefined) return;
    
    const points = this.calculateScore(category);
    this.scores[category] = points;
    this.totalScore += points;
    this.currentRound++;
    this.rollsLeft = 3;
    this.dice = [0, 0, 0, 0, 0];
  }

  calculateScore(category) {
    const counts = this.dice.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

    const sum = this.dice.reduce((a, b) => a + b, 0);
    const sorted = Object.values(counts).sort((a, b) => b - a);

    switch(category) {
      case 'ones': return counts[1] ? counts[1] * 1 : 0;
      case 'twos': return counts[2] ? counts[2] * 2 : 0;
      case 'threes': return counts[3] ? counts[3] * 3 : 0;
      case 'fours': return counts[4] ? counts[4] * 4 : 0;
      case 'fives': return counts[5] ? counts[5] * 5 : 0;
      case 'sixes': return counts[6] ? counts[6] * 6 : 0;
      case 'threeOfKind': return sorted[0] >= 3 ? sum : 0;
      case 'fourOfKind': return sorted[0] >= 4 ? sum : 0;
      case 'fullHouse': return sorted[0] === 3 && sorted[1] === 2 ? 25 : 0;
      case 'smallStraight': 
        const str1 = [1,2,3,4].every(n => counts[n]) || [2,3,4,5].every(n => counts[n]) || [3,4,5,6].every(n => counts[n]);
        return str1 ? 30 : 0;
      case 'largeStraight':
        const str2 = [1,2,3,4,5].every(n => counts[n]) || [2,3,4,5,6].every(n => counts[n]);
        return str2 ? 40 : 0;
      case 'yatze': return sorted[0] === 5 ? 50 : 0;
      case 'chance': return sum;
      default: return 0;
    }
  }

  getState() {
    return {
      dice: this.dice,
      rollsLeft: this.rollsLeft,
      scores: this.scores,
      currentRound: this.currentRound,
      totalScore: this.totalScore
    };
  }
}