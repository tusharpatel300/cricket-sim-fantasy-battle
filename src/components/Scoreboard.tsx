
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
            ({match.currentBowler.oversBowled?.toFixed(1) || 0}/{match.maxOversPerBowler})
          </p>
        </div>
      )}
      
      {/* Bowler Statistics */}
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Bowling Figures:</p>
        <div className="bg-gray-50 p-2 rounded-lg text-xs overflow-auto max-h-32">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="py-1 pr-2">Bowler</th>
                <th className="py-1 px-2 text-center">O</th>
                <th className="py-1 px-2 text-center">R</th>
                <th className="py-1 px-2 text-center">W</th>
                <th className="py-1 pl-2 text-center">Econ</th>
              </tr>
            </thead>
            <tbody>
              {match.bowlingTeam.players
                .filter(player => (player.ballsBowled || 0) > 0)
                .sort((a, b) => (b.wicketsTaken || 0) - (a.wicketsTaken || 0))
                .map(bowler => {
                  const overs = bowler.oversBowled || 0;
                  const runs = bowler.runsConceded || 0;
                  const wickets = bowler.wicketsTaken || 0;
                  const balls = bowler.ballsBowled || 0;
                  const economy = balls > 0 ? (runs / (balls / 6)).toFixed(2) : "0.00";
                  
                  return (
                    <tr key={bowler.id} className="border-b border-gray-100">
                      <td className="py-1 pr-2">{bowler.name}</td>
                      <td className="py-1 px-2 text-center">{overs.toFixed(1)}</td>
                      <td className="py-1 px-2 text-center">{runs}</td>
                      <td className="py-1 px-2 text-center">{wickets}</td>
                      <td className="py-1 pl-2 text-center">{economy}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};
