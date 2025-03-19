
import React from 'react';
import { useCricket } from '@/contexts/CricketContext';
import TeamSelection from '@/components/TeamSelection';
import MatchSetup from '@/components/MatchSetup';
import PlayerSelection from '@/components/PlayerSelection';
import InningsControl from '@/components/InningsControl';
import MatchResult from '@/components/MatchResult';
import FileUpload from '@/components/FileUpload';
import { CricketProvider } from '@/contexts/CricketContext';

const IndexContent = () => {
  const { state } = useCricket();
  const { matchStep } = state;
  
  // Render different components based on match step
  const renderMatchStep = () => {
    switch (matchStep) {
      case 'fileUpload':
        return <FileUpload />;
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

const Index = () => {
  return (
    <CricketProvider>
      <IndexContent />
    </CricketProvider>
  );
};

export default Index;
