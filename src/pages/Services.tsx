import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      title: "Individual Therapy",
      description: "One-on-one sessions tailored to your specific needs and goals.",
      features: ["Cognitive Behavioral Therapy", "Psychodynamic Therapy", "Mindfulness-Based Treatment"],
      duration: "50 minutes",
    },
    {
      title: "Couples Therapy",
      description: "Relationship counseling to improve communication and strengthen bonds.",
      features: ["Communication Skills", "Conflict Resolution", "Intimacy Building"],
      duration: "75 minutes",
    },
    {
      title: "Group Therapy",
      description: "Supportive group sessions for shared experiences and peer support.",
      features: ["Anxiety Support Groups", "Depression Recovery", "Life Transitions"],
      duration: "90 minutes",
    },
    {
      title: "Psychiatric Evaluation",
      description: "Comprehensive assessment for diagnosis and treatment planning.",
      features: ["Mental Health Assessment", "Medication Management", "Treatment Planning"],
      duration: "90 minutes",
    },
    {
      title: "Crisis Support",
      description: "Immediate support during mental health emergencies.",
      features: ["24/7 Availability", "Crisis Intervention", "Safety Planning"],
      duration: "As needed",
    },
    {
      title: "Telehealth Sessions",
      description: "Convenient online therapy sessions from the comfort of your home.",
      features: ["Video Consultations", "Secure Platform", "Flexible Scheduling"],
      duration: "50 minutes",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-soft-gray to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Mental Health Services
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive psychiatric care designed to support your mental wellness 
                journey with evidence-based treatments and compassionate care.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {services.map((service, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-muted-foreground mb-4">
                      {service.description}
                    </p>
                    <div className="mb-4">
                      <h4 className="font-semibold text-foreground mb-2">Includes:</h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="text-sm text-muted-foreground">
                            • {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-auto">
                      <p className="text-sm text-muted-foreground mb-3">
                        Duration: {service.duration}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-muted-foreground mb-8">
                Take the first step towards better mental health. 
                Contact us to schedule your consultation.
              </p>
              <Button asChild size="lg">
                <Link to="/contact">Schedule Consultation</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Services;