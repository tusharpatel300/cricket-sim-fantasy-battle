
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { 
  Match, 
  Team, 
  Player, 
  DeliveryOutcome, 
  processDelivery, 
  initializeTeams,
  createTeamFromExcelData
} from '../utils/cricketUtils';

// Define the state type
interface CricketState {
  match: Match;
  matchStep: 'fileUpload' | 'teamSelection' | 'tossSelection' | 'batting' | 'firstInnings' | 'secondInnings' | 'result';
  isLoading: boolean;
  error: string | null;
}

// Define the action types
type CricketAction =
  | { type: 'INITIALIZE_MATCH' }
  | { type: 'INITIALIZE_MATCH_WITH_DATA', payload: any }
  | { type: 'SET_BATTING_TEAM', payload: 'A' | 'B' }
  | { type: 'SELECT_STRIKER', payload: Player }
  | { type: 'SELECT_NON_STRIKER', payload: Player }
  | { type: 'SELECT_BOWLER', payload: Player }
  | { type: 'PROCESS_DELIVERY', payload: DeliveryOutcome }
  | { type: 'SET_MATCH_STEP', payload: CricketState['matchStep'] }
  | { type: 'RESET_MATCH' }
  | { type: 'SET_ERROR', payload: string }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: CricketState = {
  match: {
    teamA: { name: 'Team A', players: [] },
    teamB: { name: 'Team B', players: [] },
    overs: 20,
    maxOversPerBowler: 4,
    currentInnings: 1,
    isMatchStarted: false,
    isMatchCompleted: false,
  },
  matchStep: 'fileUpload', // Start with file upload step
  isLoading: false,
  error: null,
};

// Create the context
interface CricketContextType {
  state: CricketState;
  dispatch: React.Dispatch<CricketAction>;
}

const CricketContext = createContext<CricketContextType | undefined>(undefined);

// Define the reducer
const cricketReducer = (state: CricketState, action: CricketAction): CricketState => {
  switch (action.type) {
    case 'INITIALIZE_MATCH': {
      const { teamA, teamB } = initializeTeams();
      return {
        ...state,
        match: {
          ...state.match,
          teamA,
          teamB,
          isMatchStarted: false,
          isMatchCompleted: false,
          currentInnings: 1,
          target: undefined,
          result: undefined,
          striker: undefined,
          nonStriker: undefined,
          currentBowler: undefined,
        },
        matchStep: 'teamSelection',
        error: null,
      };
    }
    
    case 'INITIALIZE_MATCH_WITH_DATA': {
      const { headers, teamA: teamAData, teamB: teamBData } = action.payload;
      
      const teamA = createTeamFromExcelData('Team A', teamAData, headers);
      const teamB = createTeamFromExcelData('Team B', teamBData, headers);
      
      return {
        ...state,
        match: {
          ...state.match,
          teamA,
          teamB,
          isMatchStarted: false,
          isMatchCompleted: false,
          currentInnings: 1,
          target: undefined,
          result: undefined,
          striker: undefined,
          nonStriker: undefined,
          currentBowler: undefined,
        },
        matchStep: 'teamSelection',
        error: null,
      };
    }
    
    case 'SET_BATTING_TEAM': {
      const battingTeam = action.payload === 'A' ? state.match.teamA : state.match.teamB;
      const bowlingTeam = action.payload === 'A' ? state.match.teamB : state.match.teamA;
      
      return {
        ...state,
        match: {
          ...state.match,
          battingTeam,
          bowlingTeam,
          isMatchStarted: true,
        },
        matchStep: 'batting',
      };
    }
    
    case 'SELECT_STRIKER': {
      return {
        ...state,
        match: {
          ...state.match,
          striker: action.payload,
        },
      };
    }
    
    case 'SELECT_NON_STRIKER': {
      return {
        ...state,
        match: {
          ...state.match,
          nonStriker: action.payload,
        },
      };
    }
    
    case 'SELECT_BOWLER': {
      // Only move to first innings when we have striker, non-striker and bowler
      const newMatchStep = 
        state.match.striker && 
        state.match.nonStriker ? 
          state.match.currentInnings === 1 ? 'firstInnings' : 'secondInnings' : 
          state.matchStep;
      
      return {
        ...state,
        match: {
          ...state.match,
          currentBowler: action.payload,
        },
        matchStep: newMatchStep,
      };
    }
    
    case 'PROCESS_DELIVERY': {
      const updatedMatch = processDelivery(state.match, action.payload);
      let matchStep = state.matchStep;
      
      // Update match step based on match state
      if (updatedMatch.isMatchCompleted) {
        matchStep = 'result';
      } else if (updatedMatch.currentInnings === 2 && state.match.currentInnings === 1) {
        // If innings changed from 1 to 2
        matchStep = 'batting';
      } else if (updatedMatch.striker === undefined && !updatedMatch.isMatchCompleted) {
        // If we need a new batsman (after wicket)
        matchStep = 'batting';
      } else if (updatedMatch.currentBowler === undefined && !updatedMatch.isMatchCompleted) {
        // If we need a new bowler (end of over)
        matchStep = 'batting';
      }
      
      return {
        ...state,
        match: updatedMatch,
        matchStep,
      };
    }
    
    case 'SET_MATCH_STEP': {
      return {
        ...state,
        matchStep: action.payload,
      };
    }
    
    case 'RESET_MATCH': {
      return initialState;
    }
    
    case 'SET_ERROR': {
      return {
        ...state,
        error: action.payload,
      };
    }
    
    case 'CLEAR_ERROR': {
      return {
        ...state,
        error: null,
      };
    }
    
    default:
      return state;
  }
};

// Create the provider component
export const CricketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cricketReducer, initialState);
  
  return (
    <CricketContext.Provider value={{ state, dispatch }}>
      {children}
    </CricketContext.Provider>
  );
};

// Custom hook for using the context
export const useCricket = () => {
  const context = useContext(CricketContext);
  if (context === undefined) {
    throw new Error('useCricket must be used within a CricketProvider');
  }
  return context;
};
