import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Board from './components/board'
import Description from './components/description'
import Moves from './components/moves'
import { Config, ConfigProps } from './components/config'
import { History, Layers } from 'lucide-react'
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'

function App() {
  const [config, setConfig] = useState<ConfigProps>({
    variation: "",
    mode: "",
    player1: "",
    player2: "",
  });
  const [moves, setMoves] = useState<Array<string>>([]);
  const [winner, setWinner] = useState<string>("");
  const [confetti, setConfetti] = useState<boolean>(false);
  const { width, height } = useWindowSize()
  
  useEffect(() => {
    setMoves([])
    setWinner("")
    setConfetti(false)
  }, [config]);

  useEffect(() => {
    if (winner !== "") {
      setMoves((m) => [...m, `Congratulations! The winner is ${winner}!!!`])
      setConfetti(true)
    }
  }, [winner])

  return (
    <div className='w-full'>
      {confetti && <Confetti width={width} height={height} recycle={false}/>}
      <div className='flex flex-col md:flex-row justify-around gap-4 lg:gap-8 m-4 lg:m-8'>
        <Card className='md:w-2/3 lg:w-2/3'>
          <CardHeader className='flex flex-row justify-between items-center'>
            <CardTitle className='text-xl font-bold flex gap-2 items-center py-2'><Layers />NIMteractive</CardTitle>
            <Config 
              config={config}
              setConfig={setConfig}
              winner={winner}
            />
          </CardHeader>
          <CardContent>
            <Board 
              config={config}
              moves={moves}
              setMoves={setMoves}
              winner={winner}
              setWinner={setWinner}
            />
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
        
        <Card className='lg:w-1/3'>
          <CardHeader className='flex items-center'>
            <CardTitle className='text-xl font-bold flex gap-2 items-center py-2'><History />Moves History</CardTitle>
          </CardHeader>
          <CardContent>
            <Moves moves={moves}/>
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </div>
      <Description />
    </div>
  )
}

export default App
