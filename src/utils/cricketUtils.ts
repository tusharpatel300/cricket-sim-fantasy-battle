
export interface Player {
  id: number;
  name: string;
  battingStats: BattingStats;
  bowlingStats: BowlingStats;
  isOut?: boolean;
  runsScored?: number;
  ballsFaced?: number;
  fours?: number;
  sixes?: number;
  wicketsTaken?: number;
  runsConceded?: number;
  oversBowled?: number;
  ballsBowled?: number;
  maidens?: number;
}

export interface BattingStats {
  power: number;
  defense: number;
  timing: number;
  running: number;
}

export interface BowlingStats {
  accuracy: number;
  intelligence: number;
  variation: number;
  lineAndLength: number;
}

export interface Team {
  name: string;
  players: Player[];
  totalRuns?: number;
  wickets?: number;
  extras?: number;
  overs?: number;
  balls?: number;
}

export interface Match {
  teamA: Team;
  teamB: Team;
  battingTeam?: Team;
  bowlingTeam?: Team;
  overs: number;
  maxOversPerBowler: number;
  currentInnings: number;
  isMatchStarted: boolean;
  isMatchCompleted: boolean;
  striker?: Player;
  nonStriker?: Player;
  currentBowler?: Player;
  target?: number;
  result?: string;
}

export type DeliveryOutcome = 'dot' | '1' | '2' | '3' | '4' | '6' | 'wicket' | 'wide' | 'no-ball';

// Function to create a team from Excel data
export const createTeamFromExcelData = (teamName: string, teamData: any[], headers: string[]): Team => {
  const players: Player[] = teamData.map((row, index) => {
    // Map Excel columns to player properties
    // Headers order: ID, Player Name, Power, Defense, Timing, Running, Accuracy, Intelligence, Variation, Line & Length
    return {
      id: row[0] || index + 1, // Use ID from Excel or fallback to index
      name: row[1] || `Player ${index + 1}`, // Use name from Excel or fallback
      battingStats: {
        power: row[2] || 50,
        defense: row[3] || 50,
        timing: row[4] || 50,
        running: row[5] || 50,
      },
      bowlingStats: {
        accuracy: row[6] || 50,
        intelligence: row[7] || 50,
        variation: row[8] || 50,
        lineAndLength: row[9] || 50,
      },
      isOut: false,
      runsScored: 0,
      ballsFaced: 0,
      fours: 0,
      sixes: 0,
      wicketsTaken: 0,
      runsConceded: 0,
      oversBowled: 0,
      ballsBowled: 0,
      maidens: 0,
    };
  });

  return {
    name: teamName,
    players,
    totalRuns: 0,
    wickets: 0,
    extras: 0,
    overs: 0,
    balls: 0,
  };
};

// Helper function to generate a random delivery outcome
export const generateRandomOutcome = (): DeliveryOutcome => {
  const outcomes: DeliveryOutcome[] = ['dot', '1', '2', '3', '4', '6', 'wicket', 'wide', 'no-ball'];
  const weights = [30, 20, 10, 5, 10, 5, 10, 5, 5]; // Probabilities adjusted to be more realistic
  
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const randomValue = Math.random() * totalWeight;
  
  let cumulativeWeight = 0;
  for (let i = 0; i < outcomes.length; i++) {
    cumulativeWeight += weights[i];
    if (randomValue < cumulativeWeight) {
      return outcomes[i];
    }
  }
  
  return 'dot'; // Default to dot ball if something goes wrong
};

// Helper function to check if a player can bowl in the next over
export const canBowl = (
  player: Player, 
  match: Match, 
  previousBowler?: Player
): boolean => {
  const oversBowled = player.oversBowled || 0;
  
  // Check if the player has bowled the maximum allowed overs
  if (oversBowled >= match.maxOversPerBowler) {
    return false;
  }
  
  // Check if the player was the previous bowler
  if (previousBowler && player.id === previousBowler.id) {
    return false;
  }
  
  return true;
};

// Helper function to update match state after a delivery
export const processDelivery = (
  match: Match, 
  outcome: DeliveryOutcome
): Match => {
  const updatedMatch = { ...match };

  if (!updatedMatch.battingTeam || !updatedMatch.bowlingTeam || !updatedMatch.striker || !updatedMatch.nonStriker || !updatedMatch.currentBowler) {
    return updatedMatch;
  }

  const battingTeam = { ...updatedMatch.battingTeam };
  const bowlingTeam = { ...updatedMatch.bowlingTeam };
  let striker = { ...updatedMatch.striker };
  let nonStriker = { ...updatedMatch.nonStriker };
  const currentBowler = { ...updatedMatch.currentBowler };

  let isLegalDelivery = true;

  switch (outcome) {
    case 'dot':
      // For dot ball: Only add 1 ball to striker's count
      striker.ballsFaced = (striker.ballsFaced || 0) + 1;
      break;
      
    case '1':
      // For 1 run: Add 1 run to striker's score, Add 1 ball to striker's count, Swap striker and non-striker
      striker.runsScored = (striker.runsScored || 0) + 1;
      striker.ballsFaced = (striker.ballsFaced || 0) + 1;
      battingTeam.totalRuns = (battingTeam.totalRuns || 0) + 1;
      currentBowler.runsConceded = (currentBowler.runsConceded || 0) + 1;
      // Swap striker and non-striker
      updatedMatch.striker = nonStriker;
      updatedMatch.nonStriker = striker;
      break;
      
    case '2':
      // For 2 runs: Add 2 runs to striker's score, Add 1 ball to striker's count
      striker.runsScored = (striker.runsScored || 0) + 2;
      striker.ballsFaced = (striker.ballsFaced || 0) + 1;
      battingTeam.totalRuns = (battingTeam.totalRuns || 0) + 2;
      currentBowler.runsConceded = (currentBowler.runsConceded || 0) + 2;
      break;
      
    case '3':
      // For 3 runs: Add 3 runs to striker's score, Add 1 ball to striker's count, Swap striker and non-striker
      striker.runsScored = (striker.runsScored || 0) + 3;
      striker.ballsFaced = (striker.ballsFaced || 0) + 1;
      battingTeam.totalRuns = (battingTeam.totalRuns || 0) + 3;
      currentBowler.runsConceded = (currentBowler.runsConceded || 0) + 3;
      // Swap striker and non-striker
      updatedMatch.striker = nonStriker;
      updatedMatch.nonStriker = striker;
      break;
      
    case '4':
      // For 4 runs: Add 4 runs to striker's score, Add 1 ball to striker's count, Increment fours count
      striker.runsScored = (striker.runsScored || 0) + 4;
      striker.ballsFaced = (striker.ballsFaced || 0) + 1;
      striker.fours = (striker.fours || 0) + 1;
      battingTeam.totalRuns = (battingTeam.totalRuns || 0) + 4;
      currentBowler.runsConceded = (currentBowler.runsConceded || 0) + 4;
      break;
      
    case '6':
      // For 6 runs: Add 6 runs to striker's score, Add 1 ball to striker's count, Increment sixes count
      striker.runsScored = (striker.runsScored || 0) + 6;
      striker.ballsFaced = (striker.ballsFaced || 0) + 1;
      striker.sixes = (striker.sixes || 0) + 1;
      battingTeam.totalRuns = (battingTeam.totalRuns || 0) + 6;
      currentBowler.runsConceded = (currentBowler.runsConceded || 0) + 6;
      break;
      
    case 'wicket':
      // For wicket: Add 1 ball to striker's count, Mark batsman as out, Increment team wickets
      striker.ballsFaced = (striker.ballsFaced || 0) + 1;
      striker.isOut = true;
      battingTeam.wickets = (battingTeam.wickets || 0) + 1;
      currentBowler.wicketsTaken = (currentBowler.wicketsTaken || 0) + 1;
      updatedMatch.striker = undefined; // New batsman will be selected
      break;
      
    case 'wide':
      // For wide/no-ball: Only add to extras and team total, No ball counted, No individual stats updated
      battingTeam.totalRuns = (battingTeam.totalRuns || 0) + 1;
      battingTeam.extras = (battingTeam.extras || 0) + 1;
      currentBowler.runsConceded = (currentBowler.runsConceded || 0) + 1;
      isLegalDelivery = false; // This is an illegal delivery
      break;
      
    case 'no-ball':
      // For wide/no-ball: Only add to extras and team total, No ball counted, No individual stats updated
      battingTeam.totalRuns = (battingTeam.totalRuns || 0) + 1;
      battingTeam.extras = (battingTeam.extras || 0) + 1;
      currentBowler.runsConceded = (currentBowler.runsConceded || 0) + 1;
      isLegalDelivery = false; // This is an illegal delivery
      break;
  }

  // Update bowler's stats for legal deliveries
  if (isLegalDelivery) {
    battingTeam.balls = (battingTeam.balls || 0) + 1;
    currentBowler.ballsBowled = (currentBowler.ballsBowled || 0) + 1;
    
    // Update overs
    const completedBalls = battingTeam.balls;
    battingTeam.overs = Math.floor(completedBalls / 6) + (completedBalls % 6) / 10;
    
    // Update bowler's overs
    const bowlerBalls = currentBowler.ballsBowled;
    currentBowler.oversBowled = Math.floor(bowlerBalls / 6) + (bowlerBalls % 6) / 10;
  }

  // Update teams with modified players
  const updatedBattingTeamPlayers = battingTeam.players.map(player => {
    if (player.id === striker.id) return striker;
    if (player.id === nonStriker.id) return nonStriker;
    return player;
  });
  
  const updatedBowlingTeamPlayers = bowlingTeam.players.map(player => {
    if (player.id === currentBowler.id) return currentBowler;
    return player;
  });
  
  battingTeam.players = updatedBattingTeamPlayers;
  bowlingTeam.players = updatedBowlingTeamPlayers;
  
  updatedMatch.battingTeam = battingTeam;
  updatedMatch.bowlingTeam = bowlingTeam;

  // Only update striker/non-striker in the match object if they haven't already been changed
  // For 1 and 3 runs we already swapped them above
  if (outcome !== '1' && outcome !== '3' && outcome !== 'wicket') {
    updatedMatch.striker = striker;
    updatedMatch.nonStriker = nonStriker;
  }

  // Check if over is complete (6 legal deliveries)
  if (isLegalDelivery && battingTeam.balls && battingTeam.balls % 6 === 0) {
    // Swap striker and non-striker for the new over
    if (updatedMatch.striker && updatedMatch.nonStriker) {
      const temp = updatedMatch.striker;
      updatedMatch.striker = updatedMatch.nonStriker;
      updatedMatch.nonStriker = temp;
    }
    
    // Current bowler has completed an over and needs to be changed
    updatedMatch.currentBowler = undefined;
  }

  // Check if innings is complete
  if (
    (battingTeam.overs && battingTeam.overs >= match.overs) || 
    (battingTeam.wickets && battingTeam.wickets >= 10)
  ) {
    // If first innings is complete
    if (updatedMatch.currentInnings === 1) {
      updatedMatch.currentInnings = 2;
      updatedMatch.target = (battingTeam.totalRuns || 0) + 1;
      
      // Swap batting and bowling teams
      updatedMatch.battingTeam = updatedMatch.bowlingTeam;
      updatedMatch.bowlingTeam = battingTeam;
      
      // Reset batting team stats for second innings
      updatedMatch.battingTeam.totalRuns = 0;
      updatedMatch.battingTeam.wickets = 0;
      updatedMatch.battingTeam.extras = 0;
      updatedMatch.battingTeam.overs = 0;
      updatedMatch.battingTeam.balls = 0;
      
      // Reset player stats for second innings
      updatedMatch.battingTeam.players = updatedMatch.battingTeam.players.map(player => ({
        ...player,
        isOut: false,
        runsScored: 0,
        ballsFaced: 0,
        fours: 0,
        sixes: 0
      }));
      
      updatedMatch.bowlingTeam.players = updatedMatch.bowlingTeam.players.map(player => ({
        ...player,
        wicketsTaken: 0,
        runsConceded: 0,
        oversBowled: 0,
        ballsBowled: 0,
        maidens: 0
      }));
      
      // Reset striker, non-striker and bowler
      updatedMatch.striker = undefined;
      updatedMatch.nonStriker = undefined;
      updatedMatch.currentBowler = undefined;
    } else {
      // Second innings is complete, match is over
      updatedMatch.isMatchCompleted = true;
      
      // Determine match result
      const target = updatedMatch.target || 0;
      const runs = battingTeam.totalRuns || 0;
      
      if (runs >= target) {
        updatedMatch.result = `${battingTeam.name} wins by ${10 - (battingTeam.wickets || 0)} wickets`;
      } else if (runs === target - 1) {
        updatedMatch.result = "Match tied";
      } else {
        updatedMatch.result = `${bowlingTeam.name} wins by ${target - runs - 1} runs`;
      }
    }
  }

  // Check if target has been achieved in second innings
  if (
    updatedMatch.currentInnings === 2 && 
    updatedMatch.target && 
    (battingTeam.totalRuns || 0) >= updatedMatch.target
  ) {
    updatedMatch.isMatchCompleted = true;
    updatedMatch.result = `${battingTeam.name} wins by ${10 - (battingTeam.wickets || 0)} wickets`;
  }

  return updatedMatch;
};

export const getAvailableBatsmen = (team: Team): Player[] => {
  // Only return players who haven't batted yet (not out and not the current batsmen)
  return team.players.filter(player => !player.isOut && 
    player.id !== (team as any).striker?.id && 
    player.id !== (team as any).nonStriker?.id &&
    // Also filter out players who have already batted (check if they've faced any balls)
    (player.ballsFaced === undefined || player.ballsFaced === 0));
};

export const getAvailableBowlers = (team: Team, match: Match, previousBowler?: Player): Player[] => {
  return team.players.filter(player => canBowl(player, match, previousBowler));
};

export const initializeTeams = (): { teamA: Team; teamB: Team } => {
  // This is a temporary function to generate sample data
  // In a real implementation, this would load data from your Excel file
  
  const generatePlayer = (id: number, name: string, teamPrefix: string): Player => ({
    id,
    name: `${teamPrefix} ${name}`,
    battingStats: {
      power: Math.floor(Math.random() * 100),
      defense: Math.floor(Math.random() * 100),
      timing: Math.floor(Math.random() * 100),
      running: Math.floor(Math.random() * 100),
    },
    bowlingStats: {
      accuracy: Math.floor(Math.random() * 100),
      intelligence: Math.floor(Math.random() * 100),
      variation: Math.floor(Math.random() * 100),
      lineAndLength: Math.floor(Math.random() * 100),
    },
    isOut: false,
    runsScored: 0,
    ballsFaced: 0,
    fours: 0,
    sixes: 0,
    wicketsTaken: 0,
    runsConceded: 0,
    oversBowled: 0,
    ballsBowled: 0,
    maidens: 0,
  });

  const playerNames = [
    'Sharma', 'Kohli', 'Rahul', 'Pant', 'Jadeja',
    'Ashwin', 'Bumrah', 'Shami', 'Siraj', 'Chahal', 'Iyer'
  ];

  const teamAPlayers = playerNames.map((name, index) => 
    generatePlayer(index + 1, name, 'A')
  );

  const teamBPlayers = playerNames.map((name, index) => 
    generatePlayer(index + 100, name, 'B')
  );

  return {
    teamA: {
      name: 'Team A',
      players: teamAPlayers,
      totalRuns: 0,
      wickets: 0,
      extras: 0,
      overs: 0,
      balls: 0,
    },
    teamB: {
      name: 'Team B',
      players: teamBPlayers,
      totalRuns: 0,
      wickets: 0,
      extras: 0,
      overs: 0,
      balls: 0,
    }
  };
};
