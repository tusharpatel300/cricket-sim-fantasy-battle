
import React, { useEffect } from 'react';
import { useCricket } from '@/contexts/CricketContext';
import TeamSelection from '@/components/TeamSelection';
import MatchSetup from '@/components/MatchSetup';
import PlayerSelection from '@/components/PlayerSelection';
import InningsControl from '@/components/InningsControl';
import MatchResult from '@/components/MatchResult';

const Index = () => {
  const { state, dispatch } = useCricket();
  const { matchStep } = state;
  
  // Initialize match data when component mounts
  useEffect(() => {
    dispatch({ type: 'INITIALIZE_MATCH' });
  }, [dispatch]);
  
  // Render different components based on match step
  const renderMatchStep = () => {
    switch (matchStep) {
      case 'teamSelection':
        return <TeamSelection />;
      case 'tossSelection':
        return <MatchSetup />;
      case 'batting':
        return <PlayerSelection />;
      case 'firstInnings':
      case 'secondInnings':
        return <InningsControl />;
      case 'result':
        return <MatchResult />;
      default:
        return <div className="text-center py-12">Loading...</div>;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-cricket-pitch/20">
      {renderMatchStep()}
    </div>
  );
};

export default Index;
