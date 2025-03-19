
import React from 'react';
import { useCricket } from '@/contexts/CricketContext';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Target, Flag } from 'lucide-react';

export const Scoreboard = () => {
  const { state } = useCricket();
  const { match } = state;
  
  if (!match.battingTeam || !match.bowlingTeam) {
    return null;
  }
  
  const innings = match.currentInnings;
  const { totalRuns = 0, wickets = 0, overs = 0, extras = 0 } = match.battingTeam;
  
  // Format overs (e.g., 4.3 for 4 overs and 3 balls)
  const formattedOvers = overs.toFixed(1).replace('.0', '');
  
  return (
    <Card className="p-5 bg-white/90 backdrop-blur-lg shadow-lg border border-gray-100 rounded-xl">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {match.battingTeam.name}
          </h3>
          <div className="flex items-center mt-1">
            <p className="text-2xl font-bold text-gray-900">{totalRuns}/{wickets}</p>
            <p className="text-sm text-gray-600 ml-2">({formattedOvers} ov)</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-600">
            {innings === 1 ? 'First Innings' : 'Second Innings'}
          </p>
          
          {innings === 2 && match.target && (
            <div className="flex items-center justify-end mt-1">
              <Target className="h-4 w-4 mr-1 text-cricket-accent" />
              <p className="text-sm font-medium">
                Need {match.target - totalRuns} from {(match.overs - overs).toFixed(1).replace('.0', '')} overs
              </p>
            </div>
          )}
        </div>
      </div>
      
      <Separator className="my-3" />
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">CRR: {(totalRuns / (overs || 1)).toFixed(2)}</p>
          {innings === 2 && match.target && (
            <p className="text-gray-600">
              RRR: {((match.target - totalRuns) / ((match.overs - overs) || 1)).toFixed(2)}
            </p>
          )}
        </div>
        
        <div className="text-right">
          <p className="text-gray-600">Extras: {extras}</p>
          <p className="text-gray-600">
            {match.overs - overs > 0 
              ? `${match.overs - overs} overs remaining` 
              : 'Last over'}
          </p>
        </div>
      </div>
      
      {match.striker && match.nonStriker && (
        <div className="mt-3 bg-gray-50 p-3 rounded-lg text-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Flag className="h-3 w-3 mr-1 text-cricket-accent" />
              <p>{match.striker.name}*: {match.striker.runsScored || 0} ({match.striker.ballsFaced || 0})</p>
            </div>
            <p>{match.nonStriker.name}: {match.nonStriker.runsScored || 0} ({match.nonStriker.ballsFaced || 0})</p>
          </div>
        </div>
      )}
      
      {match.currentBowler && (
        <div className="mt-2 text-sm">
          <p className="text-gray-700">
            Bowling: {match.currentBowler.name} {match.currentBowler.wicketsTaken || 0}/{match.currentBowler.runsConceded || 0} 
            ({match.currentBowler.oversBowled || 0})
          </p>
        </div>
      )}
    </Card>
  );
};
