'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getAiPresets } from '@/app/actions';

type AIRecommenderProps = {
  onApply: (instrument: string, scale: string) => void;
  playNote: (key: string) => void;
  stopNote: (key: string) => void;
};

const formSchema = z.object({
  description: z.string().min(10, {
    message: 'Please describe the music you want to create in at least 10 characters.',
  }),
});

type Suggestion = {
  instrument: string;
  scale: string;
  reasoning: string;
};

export function AIRecommender({ onApply, playNote, stopNote }: AIRecommenderProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const result = await getAiPresets(values.description);
      setSuggestion({
        instrument: result.instrument.toLowerCase(),
        scale: result.scale.toLowerCase().replace(/\s+/g, "_"),
        reasoning: result.reasoning,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleApply() {
    if (suggestion) {
      onApply(suggestion.instrument, suggestion.scale);
      setOpen(false);
      form.reset();
      setSuggestion(null);
    }
  }

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const key = e.key.toLowerCase();
    playNote(key);
    // Append character to form value without showing it in the textarea
    const currentDescription = form.getValues('description');
    form.setValue('description', currentDescription + e.key, { shouldValidate: true });
  }, [playNote, form]);

  const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    stopNote(e.key.toLowerCase());
  }, [stopNote]);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Sparkles className="mr-2 h-4 w-4" />
          Get AI Suggestions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Preset Recommendations</DialogTitle>
          <DialogDescription>
            Describe the kind of music or vibe you're going for, and our AI will suggest an instrument and scale for you.
          </DialogDescription>
        </DialogHeader>
        
        {!suggestion && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Music Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type here and listen..."
                        {...field}
                        value=""
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyUp}
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Get Suggestions'
                )}
              </Button>
            </form>
          </Form>
        )}

        {suggestion && !isLoading && (
          <div className="space-y-4">
            <h3 className="font-semibold">Here's what we suggest:</h3>
            <div className="rounded-lg border bg-secondary/50 p-4 space-y-2">
              <p><strong>Instrument:</strong> <span className="capitalize">{suggestion.instrument}</span></p>
              <p><strong>Scale:</strong> <span className="capitalize">{suggestion.scale.replace(/_/g, " ")}</span></p>
              <p className="text-sm text-muted-foreground pt-2"><strong>Reasoning:</strong> {suggestion.reasoning}</p>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => { setSuggestion(null); form.reset(); }}>Try Again</Button>
              <Button onClick={handleApply}>Apply Preset</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
