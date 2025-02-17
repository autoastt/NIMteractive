import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Board from './components/board'
import Description from './components/description'
import Moves from './components/moves'
import { Config, ConfigProps } from './components/config'
import { AlignEndHorizontal, Eye, History, Lightbulb } from 'lucide-react'
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'
import Header from './components/Header'
import Footer from './components/Footer'
import { instruction } from './lib/constants'
import Spoilers from './components/spoilers'

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
    <div className='w-full min-h-screen'>
      <Header />
      {confetti && <Confetti width={width} height={height} recycle={false}/>}
      <div className='flex flex-col md:flex-row justify-around gap-4 lg:gap-8 m-4 lg:m-8'>
        <Card className='md:w-2/3 lg:w-2/3'>
          <CardHeader>
            <CardTitle className='flex gap-2 justify-between items-center'>
              <div className='text-xl font-bold flex gap-2 justify-between items-center'>
                <AlignEndHorizontal />{config.variation ? config.variation : "Nim"}
              </div>
              <Config 
                config={config}
                setConfig={setConfig}
                winner={winner}
              />
            </CardTitle>
            <CardDescription>
              {config.variation !== "" ? instruction[config.variation] : null}
            </CardDescription>
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
          <CardHeader className='flex'>
            <CardTitle className='text-xl font-bold flex gap-2 items-center py-2'>
              <History />Moves History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Moves moves={moves}/>
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </div>

      <div className='flex flex-col md:flex-row justify-around gap-4 lg:gap-8 m-4 lg:m-8'>
        <Card className='md:w-1/2'>
          <CardHeader className='flex'>
            <CardTitle className='text-xl font-bold flex gap-2 items-center py-2'>
              <Lightbulb />What is Nim?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Description />
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>

        <Card className='md:w-1/2'>
          <CardHeader className='flex'>
            <CardTitle className='text-xl font-bold flex gap-2 items-center py-2'>
              <Eye />Spoilers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Spoilers />
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </div>

      <Footer />
    </div>
  )
}

export default App
