import { useState } from "react";
import Hero from "@/components/Hero";
import QueryInterface from "@/components/QueryInterface";
import ExplanationDisplay from "@/components/ExplanationDisplay";

const Index = () => {
  const [showQuery, setShowQuery] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const handleGetStarted = () => {
    setShowQuery(true);
  };

  const calculateReadabilityScore = (text) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    const syllables = words * 1.5;
    
    const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    
    if (score >= 90) return { grade: "5th grade", level: "Very Easy" };
    if (score >= 80) return { grade: "6th grade", level: "Easy" };
    if (score >= 70) return { grade: "7th grade", level: "Fairly Easy" };
    if (score >= 60) return { grade: "8th-9th grade", level: "Standard" };
    return { grade: "10th-12th grade", level: "Fairly Difficult" };
  };

  const handleSearch = async (query) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockExplanation = {
      medicationName: query,
      explanation: `${query} is a medication commonly prescribed to help manage certain health conditions. It works by helping your body maintain proper balance and function. Take this medication exactly as your doctor prescribed, usually once or twice daily with food. Common side effects may include mild headache or upset stomach, which usually improve as your body adjusts. Contact your doctor if you experience any severe or persistent symptoms.`,
      keyPoints: [
        "Take with food to reduce stomach upset",
        "Do not skip doses - take at the same time each day",
        "May take 2-4 weeks to see full effects",
        "Avoid alcohol while taking this medication",
        "Store at room temperature away from moisture"
      ],
      sources: [
        { name: "OpenFDA Drug Database", snippet: "Official FDA-approved labeling information" },
        { name: "RxNorm", snippet: "Standardized drug nomenclature" },
        { name: "Clinical Guidelines", snippet: "Evidence-based treatment recommendations" }
      ]
    };
    
    const readability = calculateReadabilityScore(mockExplanation.explanation);
    mockExplanation.readabilityScore = readability;
    
    setExplanation(mockExplanation);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {!showQuery ? (
          <Hero onGetStarted={handleGetStarted} />
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Medication Search</h1>
              <p className="text-muted-foreground">Enter a medication name to get a clear, easy-to-understand explanation</p>
            </div>
            
            <QueryInterface onSearch={handleSearch} isLoading={isLoading} />
            
            {explanation && !isLoading && (
              <ExplanationDisplay
                medicationName={explanation.medicationName}
                explanation={explanation.explanation}
                keyPoints={explanation.keyPoints}
                readabilityScore={explanation.readabilityScore}
                sources={explanation.sources}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
