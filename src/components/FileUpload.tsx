
import React, { useState } from 'react';
import { useCricket } from '@/contexts/CricketContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileUp } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

const FileUpload = () => {
  const { dispatch } = useCricket();
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    
    try {
      const data = await readExcelFile(file);
      if (validateData(data)) {
        dispatch({ 
          type: 'INITIALIZE_MATCH_WITH_DATA', 
          payload: data 
        });
        toast.success('Team data loaded successfully');
      } else {
        toast.error('Invalid data format in the Excel file');
      }
    } catch (error) {
      console.error('Error reading Excel file:', error);
      toast.error('Failed to read the Excel file');
    } finally {
      setIsLoading(false);
    }
  };

  const readExcelFile = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = 'Team Selection';
          
          // Check if the sheet exists
          if (!workbook.Sheets[sheetName]) {
            toast.error(`Sheet "${sheetName}" not found`);
            reject(new Error(`Sheet "${sheetName}" not found`));
            return;
          }
          
          const sheet = workbook.Sheets[sheetName];
          
          // Extract Team A data (T4:AC14)
          const teamARange = { s: { r: 3, c: 19 }, e: { r: 13, c: 28 } };
          const teamAData = XLSX.utils.sheet_to_json(sheet, { 
            range: teamARange,
            header: 1
          });
          
          // Extract Team B data (T19:AC29)
          const teamBRange = { s: { r: 18, c: 19 }, e: { r: 28, c: 28 } };
          const teamBData = XLSX.utils.sheet_to_json(sheet, { 
            range: teamBRange,
            header: 1
          });
          
          // Extract headers (T4:AC4)
          const headersRange = { s: { r: 3, c: 19 }, e: { r: 3, c: 28 } };
          const headers = XLSX.utils.sheet_to_json(sheet, { 
            range: headersRange,
            header: 1
          })[0];
          
          resolve({
            headers,
            teamA: teamAData.slice(1), // Skip header row
            teamB: teamBData.slice(1)  // Skip header row
          });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  };

  const validateData = (data: any): boolean => {
    // Basic validation for the Excel data
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
            Please upload the "Match System.xlsm" file containing team information
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <input
              type="file"
              id="file-upload"
              accept=".xlsx,.xlsm,.xlsb,.xls"
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
                Accepts Excel files (.xlsx, .xlsm)
              </span>
            </label>
          </div>
          
          <div className="text-center text-xs text-gray-500">
            <p>The Excel file should contain:</p>
            <p>• "Team Selection" sheet with player data</p>
            <p>• Team A players in range T4:AC14</p>
            <p>• Team B players in range T19:AC29</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FileUpload;
