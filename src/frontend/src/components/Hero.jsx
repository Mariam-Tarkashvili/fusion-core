import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, BookOpen, CheckCircle } from "lucide-react";

const Hero = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
      <div className="space-y-4 max-w-3xl">
        <div className="inline-block animate-fade-in">
          <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            AI-Powered Medical Translation
          </span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
          Understand Your
          <span className="text-primary block mt-2">Medications Simply</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get clear, easy-to-read explanations of complex medical information. 
          No more confusing medical jargon - just simple answers you can trust.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="hero" 
          size="lg" 
          onClick={onGetStarted}
          className="group"
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
        <Button variant="outline" size="lg">
          Learn More
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl">
        <div className="flex flex-col items-center space-y-3 p-6">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">Verified Sources</h3>
          <p className="text-sm text-muted-foreground">
            Information from trusted medical databases like OpenFDA and RxNorm
          </p>
        </div>

        <div className="flex flex-col items-center space-y-3 p-6">
          <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-secondary" />
          </div>
          <h3 className="font-semibold text-lg">Easy to Read</h3>
          <p className="text-sm text-muted-foreground">
            All explanations written at a middle-school reading level
          </p>
        </div>

        <div className="flex flex-col items-center space-y-3 p-6">
          <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-accent" />
          </div>
          <h3 className="font-semibold text-lg">AI-Powered</h3>
          <p className="text-sm text-muted-foreground">
            Advanced AI translates complex medical terms into plain language
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
