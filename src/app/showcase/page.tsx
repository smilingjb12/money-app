"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ActionButton } from "@/components/action-button";
import LoadingIndicator from "@/components/loading-indicator";
import { AlertCircle, Bell, Calendar, ChevronDown, Download, Heart, Mail, MessageSquare, Settings, Star, TrendingUp, User, Users } from "lucide-react";

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Component Showcase</h1>
          <p className="text-lg text-muted-foreground">
            Displaying all shadcn components with current theme colors
          </p>
        </div>

        {/* Dashboard Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
            Dashboard Components
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                <Progress value={65} className="mt-3" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,350</div>
                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                <Progress value={45} className="mt-3" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Downloads</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,234</div>
                <p className="text-xs text-muted-foreground">+19% from last month</p>
                <Progress value={80} className="mt-3" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your team members and their account permissions here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Sofia Davis</p>
                  <p className="text-sm text-muted-foreground">sofia.davis@email.com</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Actions <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit permissions</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Remove member</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-sm text-muted-foreground">john.doe@email.com</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Actions <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit permissions</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Remove member</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Messaging/Chat Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
            Messaging & Notifications
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Recent Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">Alice Brown</p>
                      <span className="text-xs text-muted-foreground">2 min ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Hey! Just finished the design mockups. What do you think?
                    </p>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Like message</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>BC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">Bob Chen</p>
                      <span className="text-xs text-muted-foreground">5 min ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The new components look great! Should we deploy to staging?
                    </p>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Like message</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>System Update</AlertTitle>
                <AlertDescription>
                  Maintenance window scheduled for tonight at 2 AM EST. Expected downtime: 30 minutes.
                </AlertDescription>
              </Alert>

              <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/10 dark:text-yellow-200">
                <Bell className="h-4 w-4" />
                <AlertTitle>New Feature Available</AlertTitle>
                <AlertDescription>
                  Dark mode is now available! Toggle it from the settings menu.
                </AlertDescription>
              </Alert>

              <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/10 dark:text-green-200">
                <Star className="h-4 w-4" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Your profile has been updated successfully.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </section>

        {/* Forms Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
            Form Components
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Form</CardTitle>
                <CardDescription>Send us a message and we&apos;ll get back to you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What's this about?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Tell us more..." className="min-h-[100px]" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Send Message</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Button Variants</CardTitle>
                <CardDescription>All available button styles and states.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Primary Buttons</p>
                  <div className="flex flex-wrap gap-2">
                    <Button>Default</Button>
                    <Button size="sm">Small</Button>
                    <Button size="lg">Large</Button>
                    <Button disabled>Disabled</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Secondary Buttons</p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Destructive Buttons</p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">Destructive Outline</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Custom Action Button</p>
                  <ActionButton>Custom Action</ActionButton>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Interactive Elements */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
            Interactive Elements
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dropdown Menus</CardTitle>
                <CardDescription>Various dropdown menu examples.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Messages
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Calendar className="mr-2 h-4 w-4" />
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Create new</DropdownMenuItem>
                      <DropdownMenuItem>Import data</DropdownMenuItem>
                      <DropdownMenuItem>Export data</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dialog Examples</CardTitle>
                <CardDescription>Alert dialogs and modals.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">Delete Item</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your item
                          and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Open settings</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Loading States */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
            Loading States
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Skeleton Loading</CardTitle>
                <CardDescription>Placeholder content while data loads.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loading Indicators</CardTitle>
                <CardDescription>Custom loading indicators and progress bars.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Custom Loading Indicator</p>
                  <div className="flex justify-center">
                    <LoadingIndicator />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Progress Bars</p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Upload Progress</span>
                        <span>33%</span>
                      </div>
                      <Progress value={33} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Processing</span>
                        <span>67%</span>
                      </div>
                      <Progress value={67} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Complete</span>
                        <span>100%</span>
                      </div>
                      <Progress value={100} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}