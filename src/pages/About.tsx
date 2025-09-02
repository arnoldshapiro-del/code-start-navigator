import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-soft-gray to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                About Dr. Sarah Mitchell
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Dedicated to providing compassionate, evidence-based mental health care 
                to help you achieve lasting wellness and personal growth.
              </p>
            </div>
          </div>
        </section>

        {/* About Content */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">
                    My Approach to Mental Health
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    I believe in creating a safe, non-judgmental space where you can 
                    explore your thoughts and feelings. My therapeutic approach combines 
                    evidence-based practices with genuine compassion and understanding.
                  </p>
                  <p className="text-muted-foreground">
                    Every individual's journey is unique, and I tailor my treatment 
                    methods to meet your specific needs and goals. Together, we'll work 
                    towards sustainable healing and personal growth.
                  </p>
                </div>
                <div className="bg-primary/5 p-8 rounded-lg">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Treatment Philosophy
                  </h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li>• Patient-centered care</li>
                    <li>• Evidence-based treatments</li>
                    <li>• Holistic wellness approach</li>
                    <li>• Cultural sensitivity</li>
                    <li>• Collaborative treatment planning</li>
                  </ul>
                </div>
              </div>

              {/* Credentials */}
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Education & Training
                    </h3>
                    <div className="space-y-3 text-muted-foreground">
                      <div>
                        <p className="font-medium">MD, Psychiatry</p>
                        <p className="text-sm">Harvard Medical School</p>
                      </div>
                      <div>
                        <p className="font-medium">Residency in Psychiatry</p>
                        <p className="text-sm">Johns Hopkins Hospital</p>
                      </div>
                      <div>
                        <p className="font-medium">Fellowship in Adult Psychiatry</p>
                        <p className="text-sm">Mayo Clinic</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Certifications
                    </h3>
                    <div className="space-y-3 text-muted-foreground">
                      <div>
                        <p className="font-medium">Board Certified Psychiatrist</p>
                        <p className="text-sm">American Board of Psychiatry</p>
                      </div>
                      <div>
                        <p className="font-medium">Licensed Physician</p>
                        <p className="text-sm">State Medical Board</p>
                      </div>
                      <div>
                        <p className="font-medium">Member</p>
                        <p className="text-sm">American Psychiatric Association</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;