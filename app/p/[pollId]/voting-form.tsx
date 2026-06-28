'use client';
import { castVote } from '@/actions/vote';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PollWithVoteCounts } from '@/data/poll';
import { CheckCircle2, Loader2, Lock } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

interface VotingFormProps {
  poll: PollWithVoteCounts;
  hasVoted: boolean;
  votedOptionId: string | null;
  totalVotes: number;
  isClosed: boolean; // 🌟 Accept prop
}

export default function VotingForm({
  poll,
  hasVoted: initialHasVoted,
  votedOptionId: initialVotedOptionId,
  totalVotes: initialTotalVotes,
  isClosed, // 🌟 Destructure
}: VotingFormProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [votedOptionId, setVotedOptionId] = useState<string | null>(initialVotedOptionId);
  const [totalVotes, setTotalVotes] = useState(initialTotalVotes);
  const [options, setOptions] = useState<PollWithVoteCounts['options']>(poll.options);

  const [isPending, startTransition] = useTransition();

  // 🌟 Force view transition state to true if the entire poll has been closed
  const showResults = hasVoted || isClosed;

  const handleVoteSubmit = async () => {
    if (!selectedOptionId || isClosed) return;

    startTransition(async () => {
      const result = await castVote({ pollId: poll._id.toString(), optionId: selectedOptionId });

      if (!result.success) {
        toast.error('Action Blocked', {
          description: result.error || 'Failed to submit vote.',
        });
        return;
      }

      setOptions((prevOptions) =>
        prevOptions.map((opt) =>
          opt._id.toString() === selectedOptionId ? { ...opt, voteCount: opt.voteCount + 1 } : opt
        )
      );
      setTotalVotes((prev) => prev + 1);
      setVotedOptionId(selectedOptionId);
      setHasVoted(true);

      toast.success('Vote Counted!', {
        description: 'Your response has been securely tracked.',
      });
    });
  };

  return (
    <Card className="w-full border-border shadow-xl backdrop-blur-md relative overflow-hidden">
      {/* Dynamic top gradient bar based on open/closed state */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 transition-colors duration-300 ${isClosed ? 'bg-muted-foreground/30' : 'bg-linear-to-r from-primary via-purple-500 to-pink-500'}`
        }
      />

      <CardHeader className="space-y-2 pt-8">
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
          {poll.question}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 relative">
        {showResults ? (
          <div className="space-y-4 animate-fade-in">
            {options.map((option) => {
              const percentage = totalVotes > 0 ? Math.round((option.voteCount / totalVotes) * 100) : 0;
              const isUserChoice = option._id.toString() === votedOptionId;

              return (
                <div
                  key={option._id.toString()}
                  className="group relative overflow-hidden rounded-xl border border-border/60 p-4 transition-all duration-300"
                >
                  {/* Premium Background Progress Overlay */}
                  <div
                    className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out ${isUserChoice ? 'bg-primary/10' : 'bg-primary/5'
                      }`}
                    style={{ width: `${percentage}%` }}
                  />

                  {/* Sleek Hover-Triggered Left Accent Slider */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300 ${isUserChoice
                      ? 'bg-primary scale-y-100'
                      : 'bg-primary/40 scale-y-0 group-hover:scale-y-100'
                      }`}
                  />

                  {/* Content Foreground Row */}
                  <div className="relative flex justify-between items-center text-sm font-medium gap-4">
                    <span className="flex items-center gap-2 text-foreground/90">
                      {option.text}
                      {isUserChoice && (
                        <CheckCircle2 className="w-4 h-4 text-primary inline shrink-0" />
                      )}
                    </span>
                    <span className="text-muted-foreground font-mono shrink-0">
                      {percentage}% ({option.voteCount})
                    </span>
                  </div>
                </div>
              );
            })}

            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono pt-2">
              <span className="flex items-center gap-1">
                {isClosed && <Lock className="w-3 h-3" />}
                {isClosed ? "Read-Only Final Results" : "Accepting real-time inputs"}
              </span>
              <span>Total Responses: {totalVotes}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3 relative">
            {options.map((option) => {
              const isSelected = option._id.toString() === selectedOptionId;
              return (
                <button
                  key={option._id.toString()}
                  disabled={isPending}
                  onClick={() => setSelectedOptionId(option._id.toString())}
                  className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between group outline-none focus-visible:ring-2 focus-visible:ring-ring ${isSelected
                    ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20'
                    : 'border-input bg-background hover:bg-muted/60 text-foreground/90'
                    }`}
                >
                  <span>{option.text}</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all shrink-0 ${isSelected
                      ? 'border-primary bg-primary'
                      : 'border-input group-hover:border-muted-foreground/60'
                      }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-background" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Only show footer if user hasn't voted AND the poll is still active */}
      {!showResults && (
        <CardFooter className="bg-muted/30 border-t border-border/80 px-6 py-4 flex justify-end">
          <Button
            disabled={!selectedOptionId || isPending}
            onClick={handleVoteSubmit}
            className="px-6 font-medium tracking-wide shadow-sm"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Recording...
              </>
            ) : (
              'Submit Response'
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}