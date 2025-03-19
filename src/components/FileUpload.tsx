
import React, { useState } from 'react';
import { useCricket } from '@/contexts/CricketContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileUp } from 'lucide-react';
import { toast } from 'sonner';

const FileUpload = () => {
  const { dispatch } = useCricket();
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    
    try {
      const data = await readCSVFile(file);
      if (validateData(data)) {
        dispatch({ 
          type: 'INITIALIZE_MATCH_WITH_DATA', 
          payload: data 
        });
        toast.success('Team data loaded successfully');
      } else {
        toast.error('Invalid data format in the CSV file');
      }
    } catch (error) {
      console.error('Error reading CSV file:', error);
      toast.error('Failed to read the CSV file');
    } finally {
      setIsLoading(false);
    }
  };

  const readCSVFile = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const csvContent = e.target?.result as string;
          if (!csvContent) {
            reject(new Error('Failed to read file content'));
            return;
          }
          
          // Parse CSV content into rows
          const rows = csvContent.split('\n').map(row => 
            row.split(',').map(cell => cell.trim())
          );
          
          // Extract headers (B2:K2 - Row index 1, columns 1-10)
          const headers = rows[1]?.slice(1, 11) || [];
          
          // Extract Team A data (B3:K13 - Rows 2-12, columns 1-10)
          const teamAData = rows.slice(2, 13).map(row => row.slice(1, 11));
          
          // Extract Team B data (B18:K28 - Rows 17-27, columns 1-10)
          const teamBData = rows.slice(17, 28).map(row => row.slice(1, 11));
          
          resolve({
            headers,
            teamA: teamAData,
            teamB: teamBData
          });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const validateData = (data: any): boolean => {
    // Basic validation for the CSV data
    if (!data.headers || !Array.isArray(data.headers) || data.headers.length < 10) {
      return false;
    }
    
    if (!data.teamA || !Array.isArray(data.teamA) || data.teamA.length < 11) {
      return false;
    }
    
    if (!data.teamB || !Array.isArray(data.teamB) || data.teamB.length < 11) {
      return false;
    }
    
    return true;
  };

  return (
    <div className="container max-w-md mx-auto py-16 px-4 animate-fade-in">
      <Card className="p-6 bg-white/90 backdrop-blur-lg shadow-xl border border-gray-100 rounded-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-cricket-pitch flex items-center justify-center">
              <FileUp className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Import Team Data</h2>
          <p className="text-gray-600 mt-2">
            Please upload the CSV file containing team information
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <input
              type="file"
              id="file-upload"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <FileUp className="h-10 w-10 text-gray-400 mb-3" />
              <span className="text-sm text-gray-500">
                Click to browse or drag and drop
              </span>
              <span className="text-xs text-gray-400 mt-1">
                Accepts CSV files (.csv)
              </span>
            </label>
          </div>
          
          <div className="text-center text-xs text-gray-500">
            <p>The CSV file should contain:</p>
            <p>• Headers in row B2:K2</p>
            <p>• Team A players in range B3:K13</p>
            <p>• Team B players in range B18:K28</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FileUpload;

