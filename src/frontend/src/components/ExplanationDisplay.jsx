import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, CheckCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const ExplanationDisplay = ({
  medicationName,
  explanation,
  keyPoints,
  readabilityScore,
  sources
}) => {
  const [feedback, setFeedback] = useState(null);

  const handleFeedback = (type) => {
    setFeedback(type);
    toast.success(`Thank you for your feedback!`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 mt-8">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{medicationName}</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  Readability: {readabilityScore.grade}
                </Badge>
                <Badge variant="outline">{readabilityScore.level}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3">What You Need to Know</h3>
            <p className="text-muted-foreground leading-relaxed">{explanation}</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Key Points
            </h3>
            <ul className="space-y-2">
              {keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Sources</h3>
            <div className="space-y-2">
              {sources.map((source, index) => (
                <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                  <ExternalLink className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{source.name}</p>
                    <p className="text-xs text-muted-foreground">{source.snippet}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">Was this explanation helpful?</p>
            <div className="flex gap-2">
              <Button
                variant={feedback === 'helpful' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFeedback('helpful')}
                disabled={feedback !== null}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Helpful
              </Button>
              <Button
                variant={feedback === 'unclear' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFeedback('unclear')}
                disabled={feedback !== null}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Unclear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExplanationDisplay;
