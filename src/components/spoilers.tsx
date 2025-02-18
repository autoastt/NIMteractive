import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Spoilers() {
  return (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="pt-0">Original</AccordionTrigger>
        <AccordionContent>
          The starting position is losing position
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>21 Take-Away</AccordionTrigger>
        <AccordionContent>
          The losing position is when&nbsp;
          <code className="px-2 bg-zinc-100 rounded-sm text-red-500">
            N % 4 == 0
          </code>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Grundy's Game</AccordionTrigger>
        <AccordionContent>
          Grundy value from a pile size 0 to 10 is&nbsp;
          <code className="px-1 bg-zinc-100 rounded-sm text-red-500">
            [0, 0, 0, 1, 0, 2, 1, 0, 2, 1, 0]
          </code>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
