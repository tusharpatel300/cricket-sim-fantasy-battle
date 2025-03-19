
import React, { useState } from 'react';
import { useCricket } from '@/contexts/CricketContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Scoreboard } from './Scoreboard';
import { CircleDot, Play, Clock, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { DeliveryOutcome, generateRandomOutcome } from '@/utils/cricketUtils';

const InningsControl = () => {
  const { state, dispatch } = useCricket();
  const { match } = state;
  const [isSimulating, setIsSimulating] = useState(false);
  
  if (!match.battingTeam || !match.bowlingTeam || !match.striker || !match.nonStriker || !match.currentBowler) {
    return null;
  }
  
  const handleDelivery = (outcome?: DeliveryOutcome) => {
    const result = outcome || generateRandomOutcome();
    dispatch({ type: 'PROCESS_DELIVERY', payload: result });
    
    // Show toast notification for the delivery outcome
    const outcomeMessages: Record<DeliveryOutcome, string> = {
      'dot': 'Dot ball!',
      '1': '1 run scored',
      '2': '2 runs scored',
      '3': '3 runs scored',
      '4': 'FOUR! Boundary scored',
      '6': 'SIX! Maximum scored',
      'wicket': 'OUT! Wicket taken',
      'wide': 'Wide ball! +1 extra run',
      'no-ball': 'No ball! +1 extra run',
    };
    
    toast(outcomeMessages[result], {
      description: `Bowler: ${match.currentBowler.name}`,
      position: 'top-center',
    });
  };
  
  const simulateOver = () => {
    setIsSimulating(true);
    let ballCount = 0;
    let legalBallCount = 0;
    
    const interval = setInterval(() => {
      // If match is completed or bowler/batsman selection is needed, stop simulation
      if (!match.currentBowler || !match.striker || match.isMatchCompleted) {
        clearInterval(interval);
        setIsSimulating(false);
        return;
      }
      
      // Simulate a delivery
      const outcome = generateRandomOutcome();
      handleDelivery(outcome);
      ballCount++;
      
      // Count legal deliveries
      if (outcome !== 'wide' && outcome !== 'no-ball') {
        legalBallCount++;
      }
      
      // Stop after 6 legal deliveries or if selection needed
      if (legalBallCount >= 6 || !match.currentBowler || !match.striker) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 1200); // Delay between deliveries
    
    return () => clearInterval(interval);
  };
  
  return (
    <div className="container max-w-4xl mx-auto py-6 px-4 animate-fade-in">
      <Scoreboard />
      
      <Card className="mt-6 p-5 bg-white/90 backdrop-blur-lg shadow-md border border-gray-100 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-medium text-gray-800">Current Over</h3>
            <p className="text-sm text-gray-600">
              Bowler: {match.currentBowler.name}
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Striker: {match.striker.name} ({match.striker.runsScored || 0})
            </p>
            <p className="text-sm text-gray-600">
              Non-striker: {match.nonStriker.name} ({match.nonStriker.runsScored || 0})
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Button
            onClick={() => handleDelivery('dot')}
            disabled={isSimulating}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 transition-all"
          >
            <CircleDot className="h-4 w-4 mr-2" />
            Dot Ball
          </Button>
          
          <Button
            onClick={() => handleDelivery('1')}
            disabled={isSimulating}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 transition-all"
          >
            1 Run
          </Button>
          
          <Button
            onClick={() => handleDelivery('2')}
            disabled={isSimulating}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 transition-all"
          >
            2 Runs
          </Button>
          
          <Button
            onClick={() => handleDelivery('3')}
            disabled={isSimulating}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 transition-all"
          >
            3 Runs
          </Button>
          
          <Button
            onClick={() => handleDelivery('4')}
            disabled={isSimulating}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all"
          >
            FOUR!
          </Button>
          
          <Button
            onClick={() => handleDelivery('6')}
            disabled={isSimulating}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all"
          >
            SIX!
          </Button>
          
          <Button
            onClick={() => handleDelivery('wicket')}
            disabled={isSimulating}
            className="bg-cricket-accent/10 hover:bg-cricket-accent/20 text-cricket-accent border border-cricket-accent/30 transition-all"
          >
            Wicket
          </Button>
          
          <Button
            onClick={() => handleDelivery('wide')}
            disabled={isSimulating}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 transition-all"
          >
            Wide
          </Button>
          
          <Button
            onClick={() => handleDelivery('no-ball')}
            disabled={isSimulating}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 transition-all"
          >
            No Ball
          </Button>
        </div>
        
        <div className="flex justify-between gap-4">
          <Button
            onClick={() => handleDelivery()}
            disabled={isSimulating}
            className="w-1/2 bg-cricket-dark-green hover:bg-cricket-dark-green/90 text-white transition-all"
          >
            <Play className="h-4 w-4 mr-2" />
            Random Ball
          </Button>
          
          <Button
            onClick={simulateOver}
            disabled={isSimulating}
            className="w-1/2 bg-cricket-dark-green hover:bg-cricket-dark-green/90 text-white transition-all"
          >
            <Clock className="h-4 w-4 mr-2" />
            Simulate Over
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default InningsControl;
