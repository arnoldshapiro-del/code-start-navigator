import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar,
  MessageSquare,
  Shield,
  AlertTriangle,
  Car,
  Bus,
  Accessibility
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    preferredContact: '',
    message: '',
    urgency: 'routine'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Form Submitted",
      description: "Thank you for your information. Please call our office to schedule your evaluation.",
    });
    setFormData({
      name: '',
      email: '',
      phone: '',
      serviceType: '',
      preferredContact: '',
      message: '',
      urgency: 'routine'
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Cincinnati Office",
      primary: "(513) 794-8777",
      secondary: "8280 Montgomery Road, Suite 304",
      description: "Cincinnati, OH 45236"
    },
    {
      icon: Phone,
      title: "Fort Wright Office",
      primary: "(859) 341-7453",
      secondary: "1717 Dixie Highway, Suite 200",
      description: "Fort Wright, KY 41011"
    },
    {
      icon: Mail,
      title: "Please Call - Email Not Monitored",
      primary: "arnold.shapiro@gmail.com",
      secondary: "Email provided for reference only",
      description: "For all questions, concerns, and requests please call our office"
    }
  ];

  const officeHours = [
    { day: "Monday - Thursday", hours: "8:00 AM - 7:00 PM" },
    { day: "Friday", hours: "8:00 AM - 5:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 2:00 PM" },
    { day: "Sunday", hours: "Closed (Emergency line available)" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <BackButton />
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4">Contact Us</Badge>
          <h1 className="text-4xl font-bold mb-6">Contact us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to take the first step? We're here to help you on your journey 
            to better mental health. Reach out today.
          </p>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-16">
        {/* Emergency Notice */}
        <div className="text-center mb-12 p-6 bg-card rounded-lg">
          <p className="text-muted-foreground">
            For non-emergency concerns, call our office at (859) 341-7453. If you're experiencing a psychiatric emergency, call 911 or go to your nearest emergency room.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Schedule Your Evaluation</h2>
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="serviceType">Service Needed</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, serviceType: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual Therapy</SelectItem>
                          <SelectItem value="couples">Couples Therapy</SelectItem>
                          <SelectItem value="family">Family Therapy</SelectItem>
                          <SelectItem value="medication">Medication Management</SelectItem>
                          <SelectItem value="evaluation">Psychiatric Evaluation</SelectItem>
                          <SelectItem value="other">Other/Not Sure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, preferredContact: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="How should we contact you?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phone">Phone Call (Preferred)</SelectItem>
                          <SelectItem value="text">Text Message</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="urgency">Urgency Level</Label>
                      <Select 
                        value={formData.urgency}
                        onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="routine">Routine (1-2 weeks)</SelectItem>
                          <SelectItem value="urgent">Urgent (Within 3 days)</SelectItem>
                          <SelectItem value="crisis">Crisis (Same day)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Tell us how we can help</Label>
                    <Textarea
                      id="message"
                      placeholder="Briefly describe your concerns or what you're looking for..."
                      className="min-h-[100px]"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold mb-1">Your Privacy is Protected</p>
                        <p className="text-muted-foreground">
                          All information is confidential and HIPAA compliant. We'll never share 
                          your personal information without your consent.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Calendar className="h-4 w-4 mr-2" />
                    Request Consultation
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Contact Information</h2>

            {/* Contact Methods */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <info.icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold">{info.title}</h3>
                        <p className="text-sm font-medium">{info.primary}</p>
                        <p className="text-sm text-muted-foreground">{info.secondary}</p>
                        <p className="text-xs text-muted-foreground mt-1">{info.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Office Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Office Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {officeHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="font-medium">{schedule.day}</span>
                      <span className="text-muted-foreground">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location & Accessibility */}
            <Card>
              <CardHeader>
                <CardTitle>Location & Accessibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Car className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold">Parking</p>
                    <p className="text-muted-foreground">Free parking available on-site</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Bus className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold">Public Transportation</p>
                    <p className="text-muted-foreground">Bus routes 15, 23, and 47 nearby</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Accessibility className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold">Accessibility</p>
                    <p className="text-muted-foreground">Wheelchair accessible with elevator access</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Telehealth Option */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <MessageSquare className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-2">Telehealth Available</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Can't make it to our office? We offer secure video sessions 
                      from the comfort of your home.
                    </p>
                    <Button variant="outline" size="sm">
                      Learn About Telehealth
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;