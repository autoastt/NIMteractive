"use client";
import { Dices, Settings2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { games } from "@/lib/constants";
import { initialPiles } from "@/lib/constants";
import { botMove } from "@/lib/actions";

const formSchema = z.object({
  variation: z.string({
    required_error: "Please select game variation.",
  }),
  mode: z.string({
    required_error: "Please select game mode.",
  }),
  player1: z
    .string()
    .min(1, { message: "Player's name is required" })
    .max(20, { message: "Player's name must contain at most 20 character(s)" }),
  player2: z
    .string()
    .min(1, { message: "Player's name is required" })
    .max(20, { message: "Player's name must contain at most 20 character(s)" }),
  start: z.string(),
});

export interface ConfigProps {
  variation: string;
  mode: string;
  player1: string;
  player2: string;
  start: boolean;
}

export function Config({
  config,
  setConfig,
  setPiles,
  setSelectedPile,
  setRemove,
  setMoves,
  setPlayer,
  winner,
  setWinner,
  setConfetti,
}: {
  config: ConfigProps;
  setConfig: (value: ConfigProps) => void;
  setPiles: (value: Array<number>) => void;
  setSelectedPile: (value: string) => void;
  setRemove: (value: string) => void;
  setMoves: (value: Array<string>) => void;
  setPlayer: (value: boolean) => void;
  winner: string;
  setWinner: (value: string) => void;
  setConfetti: (value: boolean) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      player1: "autoastt",
      player2: "Bob the Conquerer",
    },
  });

  const watchMode = form.watch("mode");

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const promise = () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ name: "Sonner" }), 500),
        );
      toast.promise(promise, {
        loading: "Loading...",
        success: async () => {
          const st = values.start === "two";
          const nextConfig = {
            variation: values.variation,
            mode: values.mode,
            player1: values.player1,
            player2:
              values.mode === "one" ? "Bob the Conquerer" : values.player2,
            start: st,
          };
          setConfig(nextConfig);
          setConfetti(false);
          setWinner("");
          if (values.mode === "one" && st) {
            await botMove(
              nextConfig,
              initialPiles[values.variation],
              setPiles,
              [],
              setMoves,
              st,
              setPlayer,
              setWinner,
            );
          } else {
            setPiles(initialPiles[values.variation]);
            setSelectedPile("");
            setRemove("");
            setMoves([]);
            setPlayer(st);
          }
          return "Changes Save!";
        },
        error: "Error",
      });
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            {config.variation === "" || winner !== "" ? (
              <>
                <Dices />
                Start Here!
              </>
            ) : (
              <>
                <Settings2 />
                Settings
              </>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-72 sm:max-w-[475px]">
          <DialogHeader>
            <DialogTitle>Game Settings</DialogTitle>
            <DialogDescription>
              Select your game and mode here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <FormField
                control={form.control}
                name="variation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variation</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select variation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {games.map((game) => (
                          <SelectItem key={game} value={game}>
                            {game}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="one">Single Player</SelectItem>
                        <SelectItem value="two">Two Players</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              {watchMode === "one" && (
                <>
                  <FormField
                    control={form.control}
                    name="player1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Player</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="autoastt"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="start"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Who Start?</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select player" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="one">You</SelectItem>
                            <SelectItem value="two">
                              Bob the Conquerer
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          You will play against Bob the Conquerer
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {watchMode === "two" && (
                <>
                  <FormField
                    control={form.control}
                    name="player1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Player 1</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="autoastt"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="player2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Player 2</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Bob the Conquerer"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="start"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Who Start?</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select player" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={"one"}>Player 1</SelectItem>
                            <SelectItem value={"two"}>Player 2</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <DialogFooter className="mt-6 flex flex-col gap-4 md:gap-0">
                <Button type="submit">Save changes</Button>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
