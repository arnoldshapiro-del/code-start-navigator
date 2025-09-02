import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import heroOffice from "@/assets/hero-office.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${heroOffice})` }}
          ></div>
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Compassionate Mental Health Care
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Dr. Sarah Mitchell provides personalized psychiatric services to help you 
                achieve mental wellness and live your best life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8 py-3">
                  <Link to="/contact">Book Consultation</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
                  <Link to="/services">View Services</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* About Preview */}
        <section className="py-20 bg-soft-gray">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Welcome to a Safe Space
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
                I believe that everyone deserves access to quality mental health care. 
                My practice is built on trust, empathy, and evidence-based treatment 
                approaches tailored to your unique needs.
              </p>
              <Button asChild variant="outline" size="lg">
                <Link to="/about">Learn More About Dr. Mitchell</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-foreground mb-6">
                  Mental Health Services
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Comprehensive psychiatric care designed to support your journey toward mental wellness.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-primary rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Individual Therapy
                    </h3>
                    <p className="text-muted-foreground">
                      Personalized one-on-one sessions focused on your specific goals and challenges.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-accent rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Couples Therapy
                    </h3>
                    <p className="text-muted-foreground">
                      Relationship counseling to strengthen communication and rebuild connection.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-primary rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Psychiatric Evaluation
                    </h3>
                    <p className="text-muted-foreground">
                      Comprehensive assessment and treatment planning for optimal care.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-center mt-12">
                <Button asChild size="lg">
                  <Link to="/services">View All Services</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Ready to Begin Your Journey?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Taking the first step toward better mental health starts with a conversation. 
                Let's work together to help you thrive.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/contact">Schedule Appointment</Link>
                </Button>
                <p className="text-sm text-muted-foreground self-center">
                  Or call us at (555) 123-4567
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
