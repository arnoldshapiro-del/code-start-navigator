import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Lock,
  Calendar,
  FileText,
  MessageSquare,
  CreditCard,
  Bell,
  Settings,
  Shield,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  Download,
  Upload
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";

const PatientPortal = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Demo Mode",
      description: "This is a demo. In production, this would authenticate the user.",
    });
  };

  const portalFeatures = [
    {
      icon: Calendar,
      title: "Schedule Appointments",
      description: "Book, reschedule, or cancel appointments online 24/7.",
      benefits: ["Real-time availability", "Automatic reminders", "Telehealth options"]
    },
    {
      icon: FileText,
      title: "Access Medical Records",
      description: "View your treatment history, test results, and care plans.",
      benefits: ["Secure document storage", "Download/print records", "Share with other providers"]
    },
    {
      icon: MessageSquare,
      title: "Secure Messaging",
      description: "Communicate with your care team between appointments.",
      benefits: ["HIPAA-compliant messaging", "Quick questions", "Non-urgent concerns"]
    },
    {
      icon: CreditCard,
      title: "Billing & Payments",
      description: "View statements, make payments, and manage insurance information.",
      benefits: ["Online payments", "Payment history", "Insurance claims tracking"]
    },
    {
      icon: Bell,
      title: "Appointment Reminders",
      description: "Receive notifications about upcoming appointments and important updates.",
      benefits: ["SMS & email alerts", "Customizable preferences", "Medication reminders"]
    },
    {
      icon: Upload,
      title: "Form Submission",
      description: "Complete intake forms and assessments before your visit.",
      benefits: ["Pre-visit preparation", "Faster check-in", "Secure transmission"]
    }
  ];

  const securityFeatures = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "256-bit SSL encryption protects all data transmission"
    },
    {
      icon: Lock,
      title: "Two-Factor Authentication",
      description: "Optional 2FA for enhanced account security"
    },
    {
      icon: Eye,
      title: "Activity Monitoring",
      description: "Track login activity and access to your information"
    },
    {
      icon: Settings,
      title: "Privacy Controls",
      description: "Manage who can access your information"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <BackButton />
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4">Patient Portal</Badge>
          <h1 className="text-4xl font-bold mb-6">Secure Patient Portal</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access your health information, schedule appointments, and communicate 
            with your care team anytime, anywhere.
          </p>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Login Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Login
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Lock className="h-4 w-4 mr-2" />
                    Sign In Securely
                  </Button>
                </form>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    Forgot Password?
                  </Button>
                  <Button variant="outline" className="w-full">
                    First Time? Create Account
                  </Button>
                </div>

                {/* Quick Access */}
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Quick Access</h4>
                  <div className="space-y-2 text-sm">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Emergency Appointment
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Phone className="h-4 w-4 mr-2" />
                      Crisis Support: Call 911 or 988
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile App Promotion */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Smartphone className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-2">Get the Mobile App</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Access your portal on-the-go with our secure mobile app. 
                      Available for iOS and Android.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">App Store</Button>
                      <Button size="sm" variant="outline">Google Play</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Overview */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Portal Features</h2>
            
            {portalFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <feature.icon className="h-8 w-8 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground mb-3">{feature.description}</p>
                      <div className="space-y-1">
                        {feature.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            <span className="text-muted-foreground">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12">Your Security & Privacy</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-bold mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <Card className="mt-16">
          <CardHeader>
            <CardTitle className="text-center">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <Phone className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Technical support available during business hours
                </p>
                <p className="font-medium">(513) 794-8777 or (859) 341-7453</p>
              </div>
              <div>
                <Mail className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Email provided for reference only - please call for all inquiries
                </p>
                <p className="font-medium">ashapiro@zoomtown.com</p>
              </div>
              <div>
                <Clock className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Response Time</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  We typically respond within 2 hours during business hours
                </p>
                <p className="font-medium">Mon-Fri: 8AM-6PM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registration CTA */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Register for your patient portal account today and take control of your healthcare. 
            It only takes a few minutes to set up.
          </p>
          <Button size="lg">
            Create Your Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientPortal;