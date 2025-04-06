import React, { useState } from 'react';
import { Button, Group, ActionIcon, Tooltip } from '@mantine/core';
import axios from 'axios';
import Canvas from '../../components/Canvas';
import ProfilePopup from '../../components/ProfilePopup';

interface Result {
  expr: string;
  result: string;
}

const Home: React.FC = () => {
  const [result, setResult] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dictOfVars, setDictOfVars] = useState<Record<string, string>>({});
  const [profileOpened, setProfileOpened] = useState(false);

  const handleCalculate = async (imageData: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/calculator/process`,
        {
          image: imageData,
          dict_of_vars: dictOfVars
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      if (response.data && response.data.type === 'success' && Array.isArray(response.data.data)) {
        setResult(response.data.data);
        
        // Update variables if there are any assignments
        response.data.data.forEach((item: Result & { assign?: boolean }) => {
          if (item.assign) {
            setDictOfVars(prev => ({
              ...prev,
              [item.expr]: item.result
            }));
          }
        });
      } else {
        console.error('Invalid response format:', response.data);
        setResult([{ expr: 'Error', result: 'Invalid response format' }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setResult([{ expr: 'Error in API call', result: String(error) }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Group justify="flex-end" className="fixed top-4 right-4 z-30">
        <Tooltip label="Profile" position="bottom" withArrow>
          <ActionIcon
            onClick={() => setProfileOpened(true)}
            size="lg"
            radius="md"
            variant="filled"
            color="blue"
            className="shadow-md hover:shadow-lg transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <circle cx="12" cy="12" r="9"></circle>
              <circle cx="12" cy="10" r="3"></circle>
              <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855"></path>
            </svg>
          </ActionIcon>
        </Tooltip>
      </Group>

      <Canvas onCalculate={handleCalculate} isLoading={isLoading} />

      {result.length > 0 && (
        <div className='fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg z-20'>
          {result.map((item: Result, index: number) => (
            <div key={index} className="text-lg font-semibold">
              <p>Expression: {item.expr}</p>
              <p>Result: {item.result}</p>
            </div>
          ))}
        </div>
      )}

      <ProfilePopup 
        opened={profileOpened} 
        onClose={() => setProfileOpened(false)} 
      />
    </>
  );
};

export default Home;
