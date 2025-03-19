
import React from 'react';
import { useCricket } from '@/contexts/CricketContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bat, RotateCcw, Shield } from 'lucide-react';

const MatchSetup = () => {
  const { state, dispatch } = useCricket();
  
  const handleBattingChoice = (choice: 'A' | 'B') => {
    dispatch({ type: 'SET_BATTING_TEAM', payload: choice });
  };

  return (
    <div className="container max-w-md mx-auto py-16 px-4 animate-fade-in">
      <Card className="p-6 bg-white/90 backdrop-blur-lg shadow-xl border border-gray-100 rounded-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="h-16 w-16 rounded-full bg-cricket-pitch flex items-center justify-center">
              <RotateCcw className="h-8 w-8 text-white animate-spin-ball" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Toss Selection</h2>
          <p className="text-gray-600 mt-2">Team A won the toss</p>
        </div>
        
        <h3 className="text-center font-medium text-gray-800 mb-6">What would Team A like to do?</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Button
            onClick={() => handleBattingChoice('A')}
            className="flex flex-col items-center bg-cricket-dark-green hover:bg-cricket-dark-green/90 text-white rounded-xl py-6 transition-all transform hover:scale-105"
          >
            <Bat className="h-8 w-8 mb-2" />
            <span className="text-sm font-medium">Bat</span>
          </Button>
          
          <Button
            onClick={() => handleBattingChoice('B')}
            className="flex flex-col items-center bg-cricket-dark-green hover:bg-cricket-dark-green/90 text-white rounded-xl py-6 transition-all transform hover:scale-105"
          >
            <Shield className="h-8 w-8 mb-2" />
            <span className="text-sm font-medium">Bowl</span>
          </Button>
        </div>
        
        <p className="text-center text-xs text-gray-500 mt-4">
          Choose whether Team A would like to bat or bowl first
        </p>
      </Card>
    </div>
  );
};

export default MatchSetup;
