import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
   
export default function Spoilers() {
  return (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="pt-0">Hint 1</AccordionTrigger>
        <AccordionContent>
          This is win/lose position
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Hint 2</AccordionTrigger>
        <AccordionContent>
          Current MEX and next MEX
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Answer</AccordionTrigger>
        <AccordionContent>
          State tree?
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};