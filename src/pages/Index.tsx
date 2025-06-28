import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
              Your space to reflect, release, and reconnect—with yourself.
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Life moves fast, and feelings often go unspoken. 
              Juno is here to help you explore them. 
              As your personal AI journaling companion, Juno 
              helps you track your moods, spot patterns, and 
              gently guide you toward greater self-awareness.
            </p>
            <Button asChild className="bg-[#8766B4] hover:bg-[#8766B4]/90 text-white px-8 py-3 text-lg">
              <Link to="/dashboard">Write a Journal</Link>
            </Button>
          </div>
          <div className="relative">
              <img 
                src="/Hero.jpg" 
                alt="Mind and journaling concept illustration" 
                className="w-full h-full object-contain rounded-2xl"
              />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="px-6 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Products</h2>
            <p className="text-muted-foreground">
              Our platform offers a supportive space to help you reflect, understand your
              emotions, and stay connected with professional guidance whenever you need it.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Daily Journal Card */}
            <div className="bg-[#ECAD61] p-6 rounded-3xl">
              <h3 className="text-xl font-semibold text-white mb-2">Write Daily Journal</h3>
              <p className="text-white/90 mb-4">A space to reflect—just like this</p>
              <div className="bg-white p-4 rounded-xl mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-[#AD5E23] rounded-lg"></div>
                  <span className="text-sm">what I feel today</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Today felt like ups and downs—both was confusing at times, but I think that's what life...
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-black border-white bg-white hover:bg-gray-50">Learn more</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Write Daily Journal</DialogTitle>
                    <DialogDescription>
                      Express your thoughts and feelings in a safe, private space. Our daily journaling feature helps you process emotions, track personal growth, and develop deeper self-awareness through regular reflection.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            {/* Mood Tracker Card */}
            <div className="bg-[#ECAD61] p-6 rounded-3xl">
              <h3 className="text-xl font-semibold text-white mb-4">Weekly Mood Tracker</h3>
              <div className="bg-white p-4 rounded-xl mb-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-gray-600">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                  <div className="flex justify-between items-end h-12">
                    <div className="w-6 bg-green-400 rounded-t" style={{height: '60%'}}></div>
                    <div className="w-6 bg-yellow-400 rounded-t" style={{height: '40%'}}></div>
                    <div className="w-6 bg-green-500 rounded-t" style={{height: '80%'}}></div>
                    <div className="w-6 bg-blue-400 rounded-t" style={{height: '70%'}}></div>
                    <div className="w-6 bg-green-400 rounded-t" style={{height: '65%'}}></div>
                    <div className="w-6 bg-yellow-500 rounded-t" style={{height: '45%'}}></div>
                    <div className="w-6 bg-green-500 rounded-t" style={{height: '85%'}}></div>
                  </div>
                  <div className="flex justify-center gap-2 text-xs mt-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Happy</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Neutral</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Calm</span>
                    </div>
                  </div>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-black border-white bg-white hover:bg-gray-50">Learn more</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Weekly Mood Tracker</DialogTitle>
                    <DialogDescription>
                      Visualize your emotional patterns with our intuitive mood tracking system. Monitor weekly trends, identify triggers, and gain insights into your emotional well-being over time.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            {/* Social Media Marketing Card */}
            <div className="bg-black p-6 rounded-3xl text-white">
              <h3 className="text-xl font-semibold mb-4">Social Media Marketing</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-black border-white bg-white hover:bg-gray-50">Learn more</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Social Media Marketing</DialogTitle>
                    <DialogDescription>
                      Expand your digital presence with our comprehensive social media marketing solutions. We help you connect with your audience, build brand awareness, and drive engagement across all major platforms.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            {/* Email Marketing Card */}
            <div className="bg-muted p-6 rounded-3xl">
              <h3 className="text-xl font-semibold mb-4">Email Marketing</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-black border-gray-300 bg-white hover:bg-gray-50">Learn more</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Email Marketing</DialogTitle>
                    <DialogDescription>
                      Reach your audience directly with personalized email campaigns. Our email marketing tools help you create engaging content, automate workflows, and track performance to maximize your ROI.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            {/* Content Creation Card */}
            <div className="bg-[#BFDF5C] p-6 rounded-3xl">
              <h3 className="text-xl font-semibold mb-4">Content Creation</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-black border-gray-300 bg-white hover:bg-gray-50">Learn more</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Content Creation</DialogTitle>
                    <DialogDescription>
                      Bring your ideas to life with our professional content creation services. From blog posts to visual content, we help you craft compelling stories that resonate with your audience and drive results.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            {/* Analytics and Tracking Card */}
            <div className="bg-black p-6 rounded-3xl text-white">
              <h3 className="text-xl font-semibold mb-4">Analytics and Tracking</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-black border-white bg-white hover:bg-gray-50">Learn more</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Analytics and Tracking</DialogTitle>
                    <DialogDescription>
                      Make data-driven decisions with our comprehensive analytics and tracking solutions. Monitor performance metrics, understand user behavior, and optimize your strategies for better results.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
