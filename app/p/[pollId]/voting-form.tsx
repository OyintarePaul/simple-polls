'use client';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { castVote } from '@/app/actions/vote';
import { toast } from 'sonner';
import { SignInButton } from '@clerk/nextjs';
import { CheckCircle2, Lock, Loader2 } from 'lucide-react';

interface ClientOption {
  id: string;
  text: string;
  imageUrl?: string;
  voteCount: number;
}

interface VotingFormProps {
  poll: {
    id: string;
    question: string;
    imageUrl?: string;
    isPrivate: boolean;
    options: ClientOption[];
  };
  hasVoted: boolean;
  votedOptionId: string | null;
  totalVotes: number;
  isAuthenticated: boolean;
}

export default function VotingForm({
  poll,
  hasVoted: initialHasVoted,
  votedOptionId: initialVotedOptionId,
  totalVotes: initialTotalVotes,
  isAuthenticated,
}: VotingFormProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [votedOptionId, setVotedOptionId] = useState<string | null>(initialVotedOptionId);
  const [totalVotes, setTotalVotes] = useState(initialTotalVotes);
  const [options, setOptions] = useState<ClientOption[]>(poll.options);
  
  const [isPending, startTransition] = useTransition();

  const showAuthWall = poll.isPrivate && !isAuthenticated;

  const handleVoteSubmit = async () => {
    if (!selectedOptionId) return;

    startTransition(async () => {
      const result = await castVote(poll.id, selectedOptionId);

      if (!result.success) {
        // Sonner error variant execution
        toast.error('Action Blocked', {
          description: result.error || 'Failed to submit vote.',
        });
        return;
      }

      // Optimistic layout mutation
      setOptions((prevOptions) =>
        prevOptions.map((opt) =>
          opt.id === selectedOptionId ? { ...opt, voteCount: opt.voteCount + 1 } : opt
        )
      );
      setTotalVotes((prev) => prev + 1);
      setVotedOptionId(selectedOptionId);
      setHasVoted(true);

      // Sonner success variant execution
      toast.success('Vote Counted!', {
        description: 'Your response has been securely tracked.',
      });
    });
  };

  return (
    <Card className="w-full border-slate-200/60 dark:border-slate-800/60 shadow-xl backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <CardHeader className="space-y-2 pt-8">
        <div className="flex items-center gap-2">
          {poll.isPrivate && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              <Lock className="w-3 h-3" /> Private Poll
            </span>
          )}
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {poll.question}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 relative">
        {hasVoted ? (
          <div className="space-y-4 animate-fade-in">
            {options.map((option) => {
              const percentage = totalVotes > 0 ? Math.round((option.voteCount / totalVotes) * 100) : 0;
              const isUserChoice = option.id === votedOptionId;

              return (
                <div key={option.id} className="space-y-1.5 relative">
                  <div className="flex justify-between text-sm font-medium px-1">
                    <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      {option.text}
                      {isUserChoice && <CheckCircle2 className="w-4 h-4 text-emerald-500 inline" />}
                    </span>
                    <span className="text-slate-500 font-mono">{percentage}% ({option.voteCount})</span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={`h-8 transition-all duration-1000 ${
                      isUserChoice ? '[&>div]:bg-indigo-600' : '[&>div]:bg-slate-300 dark:[&>div]:bg-slate-700'
                    }`} 
                  />
                </div>
              );
            })}
            <p className="text-right text-xs text-muted-foreground font-mono pt-2">
              Total Responses: {totalVotes}
            </p>
          </div>
        ) : (
          <div className="space-y-3 relative">
            {options.map((option) => {
              const isSelected = option.id === selectedOptionId;
              return (
                <button
                  key={option.id}
                  disabled={showAuthWall || isPending}
                  onClick={() => setSelectedOptionId(option.id)}
                  className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-400 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/60 text-slate-700 dark:text-slate-300'
                  } ${showAuthWall ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span>{option.text}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}

            {showAuthWall && (
              <div className="absolute inset-0 bg-slate-50/40 dark:bg-slate-950/40 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center p-6 text-center animate-fade-in border border-dashed border-slate-300 dark:border-slate-800">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border max-w-sm space-y-4">
                  <div className="mx-auto w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm">Verification Required</h3>
                    <p className="text-xs text-muted-foreground">
                      The creator has restricted responses to verified community accounts. Sign in to submit your vote.
                    </p>
                  </div>
                  <SignInButton mode="modal">
                    <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                      Sign In to Verify
                    </Button>
                  </SignInButton>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {!hasVoted && !showAuthWall && (
        <CardFooter className="bg-slate-50/50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-900 px-6 py-4 flex justify-end">
          <Button
            disabled={!selectedOptionId || isPending}
            onClick={handleVoteSubmit}
            className="bg-slate-900 hover:bg-slate-800 text-slate-50 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900 px-6 font-medium tracking-wide shadow-sm"
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