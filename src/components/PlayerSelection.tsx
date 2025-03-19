
import React, { useState, useEffect } from 'react';
import { useCricket } from '@/contexts/CricketContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAvailableBatsmen, getAvailableBowlers } from '@/utils/cricketUtils';
import { UserCheck, Swords } from 'lucide-react';

const PlayerSelection = () => {
  const { state, dispatch } = useCricket();
  const { match, matchStep } = state;
  
  const [selectedStrikerId, setSelectedStrikerId] = useState<string>('');
  const [selectedNonStrikerId, setSelectedNonStrikerId] = useState<string>('');
  const [selectedBowlerId, setSelectedBowlerId] = useState<string>('');
  
  // Reset selections when the match state changes
  useEffect(() => {
    setSelectedStrikerId('');
    setSelectedNonStrikerId('');
    setSelectedBowlerId('');
  }, [match.currentInnings]);
  
  if (!match.battingTeam || !match.bowlingTeam) {
    return null;
  }
  
  const handleConfirm = () => {
    if (match.striker === undefined && selectedStrikerId) {
      const striker = match.battingTeam.players.find(p => p.id.toString() === selectedStrikerId);
      if (striker) {
        dispatch({ type: 'SELECT_STRIKER', payload: striker });
      }
    }
    
    if (match.nonStriker === undefined && selectedNonStrikerId) {
      const nonStriker = match.battingTeam.players.find(p => p.id.toString() === selectedNonStrikerId);
      if (nonStriker) {
        dispatch({ type: 'SELECT_NON_STRIKER', payload: nonStriker });
      }
    }
    
    if (match.currentBowler === undefined && selectedBowlerId) {
      const bowler = match.bowlingTeam.players.find(p => p.id.toString() === selectedBowlerId);
      if (bowler) {
        dispatch({ type: 'SELECT_BOWLER', payload: bowler });
      }
    }
  };
  
  const availableBatsmen = getAvailableBatsmen(match.battingTeam);
  const availableBowlers = getAvailableBowlers(match.bowlingTeam, match, match.currentBowler);
  
  const needsStriker = match.striker === undefined;
  const needsNonStriker = match.nonStriker === undefined;
  const needsBowler = match.currentBowler === undefined;
  
  const isReplacementAfterWicket = needsStriker && !needsNonStriker && match.currentBowler !== undefined;
  
  // Display more specific title text when replacing a batsman
  const getTitleText = () => {
    if (isReplacementAfterWicket) {
      return 'New Batsman';
    }
    return match.currentInnings === 1 ? 'First Innings' : 'Second Innings';
  };
  
  // Filter out the striker from non-striker options
  const nonStrikerOptions = availableBatsmen.filter(p => 
    p.id.toString() !== selectedStrikerId
  );
  
  // Only show the confirm button if all required selections are made
  const canConfirm = 
    (!needsStriker || selectedStrikerId) && 
    (!needsNonStriker || selectedNonStrikerId) && 
    (!needsBowler || selectedBowlerId);
  
  return (
    <div className="container max-w-md mx-auto py-8 px-4 animate-fade-in">
      <Card className="p-6 bg-white/90 backdrop-blur-lg shadow-lg border border-gray-100 rounded-xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {getTitleText()}
          </h2>
          <p className="text-gray-600 mt-1">
            {match.battingTeam.name} batting · {match.bowlingTeam.name} bowling
          </p>
          
          {match.currentInnings === 2 && match.target && (
            <div className="mt-3 p-2 bg-cricket-pitch/30 rounded-lg inline-block">
              <p className="font-medium text-gray-800">
                Target: {match.target} runs
              </p>
            </div>
          )}
          
          {isReplacementAfterWicket && (
            <div className="mt-3 p-2 bg-cricket-accent/10 rounded-lg inline-block">
              <p className="font-medium text-cricket-accent">
                Wicket! Select new batsman
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {needsStriker && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <UserCheck className="h-4 w-4 mr-2 text-cricket-dark-green" />
                Select Striker
              </label>
              <Select
                value={selectedStrikerId}
                onValueChange={setSelectedStrikerId}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select batsman" />
                </SelectTrigger>
                <SelectContent>
                  {availableBatsmen.map(player => (
                    <SelectItem key={player.id} value={player.id.toString()}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {needsNonStriker && !isReplacementAfterWicket && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <UserCheck className="h-4 w-4 mr-2 text-cricket-dark-green" />
                Select Non-Striker
              </label>
              <Select
                value={selectedNonStrikerId}
                onValueChange={setSelectedNonStrikerId}
                disabled={!selectedStrikerId && needsStriker}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select batsman" />
                </SelectTrigger>
                <SelectContent>
                  {nonStrikerOptions.map(player => (
                    <SelectItem key={player.id} value={player.id.toString()}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {needsBowler && !isReplacementAfterWicket && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Swords className="h-4 w-4 mr-2 text-cricket-accent" />
                Select Bowler
              </label>
              <Select
                value={selectedBowlerId}
                onValueChange={setSelectedBowlerId}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select bowler" />
                </SelectTrigger>
                <SelectContent>
                  {availableBowlers.map(player => (
                    <SelectItem key={player.id} value={player.id.toString()}>
                      {player.name} ({player.oversBowled || 0}/4 overs)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <Button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="w-full bg-cricket-dark-green hover:bg-cricket-dark-green/90 text-white py-2 rounded-lg transition-all duration-200"
          >
            {isReplacementAfterWicket ? 'Continue Play' : 'Confirm'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PlayerSelection;
