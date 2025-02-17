import { ExternalLink } from "lucide-react";

export default function Description() {
  return (
    <div className='flex flex-col'>
      <p className='text-justify mb-8'>
        Nim is a combinatorial game, where two players alternately take turns in taking coins from several piles. 
        The only rule is that each player must take at least one coin on their turn, but they may take more than one object in a single turn, as long as they all come from the same heap. 
        Finally, whoever unable to move loses.
      </p>
      <a className='flex gap-2 text-sm justify-end items-center hover:underline' href='https://autoastt.vercel.app/blog/nim' target='_blank'>
        Understand Nim<ExternalLink className='size-4'/>
      </a>
    </div>
  )
}