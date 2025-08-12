"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Constants } from "@/constants";
import { Routes } from "@/lib/routes";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { ArrowRight, CheckCircle, Star, Users, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const { signIn } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();

  const handleGetStarted = async () => {
    if (isAuthenticated) {
      router.push(Routes.dashboard());
    } else {
      try {
        await signIn("google");
        // After successful sign-in, redirect to dashboard
        router.push(Routes.dashboard());
      } catch (error) {
        console.error("Error signing in with Google:", error);
      }
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                    {Constants.BUSINESS.TAGLINE}
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {Constants.BUSINESS.VALUE_PROPOSITION}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => void handleGetStarted()}
                    size="lg"
                    className="text-lg px-8"
                  >
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="relative">
                <Image
                  src="/landing.png"
                  alt="Platform Dashboard Preview"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-2xl border border-border"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Everything you need to succeed
              </h2>
              <p className="text-xl text-muted-foreground">
                Powerful features designed to help you work smarter, not harder
              </p>
            </div>

            <div className="space-y-24">
              {/* Feature 1 - Image Left */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="relative">
                  <Image
                    src="/landing.png"
                    alt="Lightning Fast feature preview"
                    width={500}
                    height={350}
                    className="rounded-lg shadow-lg border border-border w-full"
                  />
                </div>
                <div className="space-y-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-foreground">
                      {Constants.BUSINESS.FEATURES.PERFORMANCE.TITLE}
                    </h3>
                    <h4 className="text-xl text-muted-foreground font-medium">
                      {Constants.BUSINESS.FEATURES.PERFORMANCE.SUBTITLE}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {Constants.BUSINESS.FEATURES.PERFORMANCE.DESCRIPTION}
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 - Image Right */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 lg:order-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-foreground">
                      {Constants.BUSINESS.FEATURES.COLLABORATION.TITLE}
                    </h3>
                    <h4 className="text-xl text-muted-foreground font-medium">
                      {Constants.BUSINESS.FEATURES.COLLABORATION.SUBTITLE}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {Constants.BUSINESS.FEATURES.COLLABORATION.DESCRIPTION}
                    </p>
                  </div>
                </div>
                <div className="relative lg:order-2">
                  <Image
                    src="/landing.png"
                    alt="Team Collaboration feature preview"
                    width={500}
                    height={350}
                    className="rounded-lg shadow-lg border border-border w-full"
                  />
                </div>
              </div>

              {/* Feature 3 - Image Left */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="relative">
                  <Image
                    src="/landing.png"
                    alt="Smart Analytics feature preview"
                    width={500}
                    height={350}
                    className="rounded-lg shadow-lg border border-border w-full"
                  />
                </div>
                <div className="space-y-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-foreground">
                      {Constants.BUSINESS.FEATURES.ANALYTICS.TITLE}
                    </h3>
                    <h4 className="text-xl text-muted-foreground font-medium">
                      {Constants.BUSINESS.FEATURES.ANALYTICS.SUBTITLE}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {Constants.BUSINESS.FEATURES.ANALYTICS.DESCRIPTION}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Simple, transparent pricing
              </h2>
              <p className="text-xl text-muted-foreground">
                Choose the perfect plan for your needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-border flex flex-col">
                <CardContent className="p-8 flex flex-col flex-1">
                  <div className="text-center flex flex-col flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Starter
                    </h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-foreground">
                        $0
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Perfect for trying out the platform
                    </p>

                    <div className="space-y-3 mb-8 flex-1">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-primary mr-3" />
                        <span className="text-foreground">
                          Up to 3 projects
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-primary mr-3" />
                        <span className="text-foreground">Basic features</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-primary mr-3" />
                        <span className="text-foreground">
                          Community support
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <Button
                        onClick={() => void handleGetStarted()}
                        className="w-full"
                        variant="outline"
                      >
                        {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary shadow-lg relative flex flex-col">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
                <CardContent className="p-8 flex flex-col flex-1">
                  <div className="text-center flex flex-col flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Professional
                    </h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-foreground">
                        $29
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      For growing teams and businesses
                    </p>

                    <div className="space-y-3 mb-8 flex-1">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-primary mr-3" />
                        <span className="text-foreground">
                          Unlimited projects
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-primary mr-3" />
                        <span className="text-foreground">
                          Advanced features
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-primary mr-3" />
                        <span className="text-foreground">
                          Priority support
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-primary mr-3" />
                        <span className="text-foreground">
                          Team collaboration
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <Button asChild className="w-full">
                        <Link href={Routes.upgrade()}>Upgrade Now</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border flex flex-col">
                <CardContent className="p-8 flex flex-col flex-1">
                  <div className="text-center flex flex-col flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Enterprise
                    </h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-foreground">
                        $99
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      For large organizations
                    </p>

                    <div className="space-y-3 mb-8 flex-1">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-primary mr-3" />
                        <span className="text-foreground">
                          Everything in Professional
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-primary mr-3" />
                        <span className="text-foreground">
                          Custom integrations
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-primary mr-3" />
                        <span className="text-foreground">
                          Dedicated support
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-primary mr-3" />
                        <span className="text-foreground">
                          Advanced security
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <Button asChild className="w-full" variant="outline">
                        <Link href={Routes.upgrade()}>Upgrade Now</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Loved by teams worldwide
              </h2>
              <p className="text-xl text-muted-foreground">
                See what our customers have to say
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-500 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    &quot;This platform has completely transformed how we manage
                    our projects. The collaboration features are
                    incredible.&quot;
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        Sarah Johnson
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Product Manager
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-500 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    &quot;The analytics features help us make better decisions.
                    We&apos;ve seen a 40% improvement in productivity.&quot;
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        Mike Chen
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Tech Lead
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-500 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    &quot;Simple, fast, and reliable. Everything we needed in
                    one place. Highly recommend to any team.&quot;
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        Emily Davis
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Startup Founder
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of teams already using {Constants.APP_NAME} to
              streamline their workflow
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => void handleGetStarted()}
                size="lg"
                className="text-lg px-8"
              >
                {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
