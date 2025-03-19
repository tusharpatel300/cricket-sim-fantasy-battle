
import React from 'react';
import { useCricket } from '@/contexts/CricketContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, RefreshCw } from 'lucide-react';

const MatchResult = () => {
  const { state, dispatch } = useCricket();
  const { match } = state;
  
  if (!match.teamA || !match.teamB || !match.result) {
    return null;
  }
  
  const handlePlayAgain = () => {
    dispatch({ type: 'RESET_MATCH' });
    dispatch({ type: 'INITIALIZE_MATCH' });
  };
  
  const renderBattingCard = (team: any) => (
    <Card className="p-4 bg-white/90 shadow-sm rounded-lg">
      <h3 className="text-lg font-medium mb-3">{team.name} - {team.totalRuns}/{team.wickets}</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm stats-table">
          <thead>
            <tr>
              <th>Batsman</th>
              <th className="text-right">Runs</th>
              <th className="text-right">Balls</th>
              <th className="text-right">4s</th>
              <th className="text-right">6s</th>
              <th className="text-right">SR</th>
            </tr>
          </thead>
          <tbody>
            {team.players.map((player: any) => {
              if (player.ballsFaced && player.ballsFaced > 0) {
                const strikeRate = ((player.runsScored || 0) / (player.ballsFaced || 1) * 100).toFixed(1);
                
                return (
                  <tr key={player.id}>
                    <td>
                      {player.name}
                      {player.isOut ? ' (out)' : ''}
                    </td>
                    <td className="text-right">{player.runsScored || 0}</td>
                    <td className="text-right">{player.ballsFaced || 0}</td>
                    <td className="text-right">{player.fours || 0}</td>
                    <td className="text-right">{player.sixes || 0}</td>
                    <td className="text-right">{strikeRate}</td>
                  </tr>
                );
              }
              return null;
            }).filter(Boolean)}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6} className="pt-2 text-xs">
                Extras: {team.extras || 0} • Total: {team.totalRuns || 0}/{team.wickets || 0} ({team.overs?.toFixed(1) || 0} Ov)
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
  
  const renderBowlingCard = (team: any) => (
    <Card className="p-4 bg-white/90 shadow-sm rounded-lg mt-4">
      <h3 className="text-lg font-medium mb-3">{team.name} Bowling</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm stats-table">
          <thead>
            <tr>
              <th>Bowler</th>
              <th className="text-right">Overs</th>
              <th className="text-right">Runs</th>
              <th className="text-right">Wickets</th>
              <th className="text-right">Econ</th>
            </tr>
          </thead>
          <tbody>
            {team.players.map((player: any) => {
              if (player.ballsBowled && player.ballsBowled > 0) {
                const economy = ((player.runsConceded || 0) / (player.oversBowled || 0.1)).toFixed(1);
                
                return (
                  <tr key={player.id}>
                    <td>{player.name}</td>
                    <td className="text-right">{player.oversBowled?.toFixed(1) || 0}</td>
                    <td className="text-right">{player.runsConceded || 0}</td>
                    <td className="text-right">{player.wicketsTaken || 0}</td>
                    <td className="text-right">{economy}</td>
                  </tr>
                );
              }
              return null;
            }).filter(Boolean)}
          </tbody>
        </table>
      </div>
    </Card>
  );
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cricket-dark-green to-cricket-light-green mb-4">
          <Trophy className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Match Completed</h2>
        <p className="text-gray-600 mt-2">{match.result}</p>
      </div>
      
      <Tabs defaultValue="team-a" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="team-a">Team A</TabsTrigger>
          <TabsTrigger value="team-b">Team B</TabsTrigger>
        </TabsList>
        
        <TabsContent value="team-a" className="space-y-4">
          {renderBattingCard(match.teamA)}
          {renderBowlingCard(match.teamB)}
        </TabsContent>
        
        <TabsContent value="team-b" className="space-y-4">
          {renderBattingCard(match.teamB)}
          {renderBowlingCard(match.teamA)}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center mt-8">
        <Button
          onClick={handlePlayAgain}
          className="bg-cricket-dark-green hover:bg-cricket-dark-green/90 text-white py-2 px-6 rounded-full shadow-md transition-all transform hover:scale-105"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Play Another Match
        </Button>
      </div>
    </div>
  );
};

export default MatchResult;
