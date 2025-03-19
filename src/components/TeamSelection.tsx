
import React from 'react';
import { useCricket } from '@/contexts/CricketContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { ChevronRight, Users } from 'lucide-react';

const TeamSelection = () => {
  const { state, dispatch } = useCricket();
  const { teamA, teamB } = state.match;

  const handleConfirm = () => {
    dispatch({ type: 'SET_MATCH_STEP', payload: 'tossSelection' });
  };

  const renderPlayerStats = (player: any) => (
    <div className="grid grid-cols-9 gap-2 text-xs font-medium">
      <div className="text-sm">{player.name}</div>
      <div className="text-center">{player.battingStats.power}</div>
      <div className="text-center">{player.battingStats.defense}</div>
      <div className="text-center">{player.battingStats.timing}</div>
      <div className="text-center">{player.battingStats.running}</div>
      <div className="text-center">{player.bowlingStats.accuracy}</div>
      <div className="text-center">{player.bowlingStats.intelligence}</div>
      <div className="text-center">{player.bowlingStats.variation}</div>
      <div className="text-center">{player.bowlingStats.lineAndLength}</div>
    </div>
  );

  const renderTeamTable = (team: any, teamName: string) => (
    <Card className="p-4 bg-white/90 backdrop-blur-sm shadow-md border border-gray-200 rounded-xl animate-fade-in transition-all-smooth hover:shadow-lg">
      <div className="flex items-center mb-4">
        <Users className="h-5 w-5 mr-2 text-cricket-dark-green" />
        <h2 className="text-xl font-semibold text-cricket-dark-green">{teamName}</h2>
      </div>
      
      <div className="grid grid-cols-9 gap-2 mb-2 text-xs font-semibold uppercase text-gray-500 border-b pb-2">
        <div>Player</div>
        <div className="text-center">PWR</div>
        <div className="text-center">DEF</div>
        <div className="text-center">TIM</div>
        <div className="text-center">RUN</div>
        <div className="text-center">ACC</div>
        <div className="text-center">INT</div>
        <div className="text-center">VAR</div>
        <div className="text-center">L&L</div>
      </div>
      
      <div className="space-y-2">
        {team.players.map((player: any) => (
          <div 
            key={player.id}
            className="py-1 odd:bg-gray-50/50 even:bg-white/50 rounded"
          >
            {renderPlayerStats(player)}
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 md:px-6 animate-slide-in">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cricket Match Simulation</h1>
        <p className="text-gray-600">Team Selection</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {renderTeamTable(teamA, 'Team A')}
        {renderTeamTable(teamB, 'Team B')}
      </div>
      
      <div className="flex justify-center mt-6">
        <Button 
          onClick={handleConfirm}
          className="bg-cricket-dark-green hover:bg-cricket-dark-green/90 text-white font-medium px-6 py-3 rounded-full shadow-md transition-all transform hover:scale-105"
        >
          Confirm Teams <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TeamSelection;
