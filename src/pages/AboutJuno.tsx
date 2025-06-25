
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const AboutJuno = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="px-6 py-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">About Juno</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Your Personal AI Journaling Companion</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Juno is more than just a digital diary—it's your personal space to reflect, release, and reconnect with yourself. 
              In our fast-paced world, feelings often go unspoken and emotions remain unexplored. Juno is here to change that.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">What Makes Juno Special</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-muted/30 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">AI-Powered Insights</h3>
                <p className="text-muted-foreground">
                  Our intelligent system helps you understand patterns in your emotions and thoughts, 
                  providing gentle guidance toward greater self-awareness.
                </p>
              </div>
              <div className="p-6 bg-muted/30 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Mood Tracking</h3>
                <p className="text-muted-foreground">
                  Visualize your emotional journey with our intuitive mood tracking features 
                  that help you spot patterns and trends over time.
                </p>
              </div>
              <div className="p-6 bg-muted/30 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Safe & Private</h3>
                <p className="text-muted-foreground">
                  Your thoughts and feelings are precious. We ensure your journal entries 
                  remain completely private and secure.
                </p>
              </div>
              <div className="p-6 bg-muted/30 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Personal Growth</h3>
                <p className="text-muted-foreground">
                  Through regular reflection and AI-guided insights, discover new aspects 
                  of yourself and foster personal growth.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Why Journaling Matters</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Research shows that regular journaling can reduce stress, improve mental clarity, 
              and enhance emotional well-being. With Juno, you're not just writing—you're engaging 
              in a meaningful dialogue with yourself, supported by AI that understands and responds 
              to your unique emotional landscape.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Whether you're processing daily experiences, working through challenges, or simply 
              wanting to understand yourself better, Juno provides the supportive space you need 
              to explore your inner world.
            </p>
          </section>

          <section className="text-center pt-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Ready to Begin Your Journey?</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Start your personal reflection journey today and discover the power of guided self-exploration.
            </p>
            <Button asChild className="bg-[#8766B4] hover:bg-[#8766B4]/90 text-white px-8 py-3 text-lg">
              <Link to="/signin">Start Journaling</Link>
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutJuno;
