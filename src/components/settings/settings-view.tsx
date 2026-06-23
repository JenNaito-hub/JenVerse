"use client";

import { useState } from "react";
import {
  User,
  Building2,
  CreditCard,
  KeyRound,
  Bell,
  Check,
} from "lucide-react";

import { currentUser } from "@/data/team";
import { getInitials } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SettingsView() {
  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="flex-wrap">
        <TabsTrigger value="profile">
          <User className="mr-1.5 h-4 w-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="workspace">
          <Building2 className="mr-1.5 h-4 w-4" />
          Workspace
        </TabsTrigger>
        <TabsTrigger value="billing">
          <CreditCard className="mr-1.5 h-4 w-4" />
          Billing
        </TabsTrigger>
        <TabsTrigger value="api">
          <KeyRound className="mr-1.5 h-4 w-4" />
          API keys
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <Bell className="mr-1.5 h-4 w-4" />
          Notifications
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <ProfileSettings />
      </TabsContent>
      <TabsContent value="workspace">
        <WorkspaceSettings />
      </TabsContent>
      <TabsContent value="billing">
        <BillingSettings />
      </TabsContent>
      <TabsContent value="api">
        <ApiSettings />
      </TabsContent>
      <TabsContent value="notifications">
        <NotificationSettings />
      </TabsContent>
    </Tabs>
  );
}

function ProfileSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border border-border">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" size="sm">
              Change avatar
            </Button>
            <p className="mt-1.5 text-xs text-muted-foreground">
              JPG, PNG or GIF. Max 2MB.
            </p>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" defaultValue="Jen" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" defaultValue="Aescentic" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue="jen.aescentic@gmail.com"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" defaultValue="Owner" disabled />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button variant="primary">Save changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function WorkspaceSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="wsName">Workspace name</Label>
            <Input id="wsName" defaultValue="JENVERSE Studio" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="wsUrl">Workspace URL</Label>
            <div className="flex items-center">
              <span className="flex h-10 items-center rounded-l-xl border border-r-0 border-input bg-secondary px-3 text-sm text-muted-foreground">
                jenverse.app/
              </span>
              <Input
                id="wsUrl"
                defaultValue="studio"
                className="rounded-l-none"
              />
            </div>
          </div>
        </div>
        <Separator />
        <div>
          <p className="mb-3 text-sm font-medium">Default models</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <div>
                <p className="text-sm font-medium">Knowledge AI</p>
                <p className="text-xs text-muted-foreground">GPT-4o</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <div>
                <p className="text-sm font-medium">Image AI</p>
                <p className="text-xs text-muted-foreground">DALL·E 3</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="primary">Save workspace</Button>
        </div>
      </CardContent>
    </Card>
  );
}

const plans = [
  {
    name: "Starter",
    price: "$0",
    features: ["100 generations / mo", "1 project", "Community support"],
    current: false,
  },
  {
    name: "Pro",
    price: "$49",
    features: ["60K credits / mo", "Unlimited projects", "Priority support"],
    current: true,
  },
  {
    name: "Scale",
    price: "$199",
    features: ["250K credits / mo", "SSO & roles", "Dedicated manager"],
    current: false,
  },
];

function BillingSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">Pro</p>
                <Badge variant="primary">Current</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                $49 / month · renews Jul 23, 2026
              </p>
            </div>
            <Button variant="outline">Manage billing</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={
              plan.current ? "border-foreground ring-1 ring-foreground" : ""
            }
          >
            <CardContent className="p-5">
              <p className="font-semibold">{plan.name}</p>
              <p className="mt-1 text-3xl font-bold">
                {plan.price}
                <span className="text-sm font-normal text-muted-foreground">
                  /mo
                </span>
              </p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-foreground" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.current ? "secondary" : "primary"}
                className="mt-5 w-full"
                disabled={plan.current}
              >
                {plan.current ? "Current plan" : "Upgrade"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

const apiKeys = [
  { id: "openai", label: "OpenAI", masked: "sk-····················7Jf2", connected: true },
  { id: "gemini", label: "Google Gemini", masked: "AIza····················x9Q", connected: true },
  { id: "supabase", label: "Supabase", masked: "Not connected", connected: false },
];

function ApiSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API keys</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Connect your providers. V1 is frontend-only — these are placeholders
          for the upcoming integration phase.
        </p>
        {apiKeys.map((key) => (
          <div
            key={key.id}
            className="flex items-center justify-between rounded-xl border border-border p-4"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <KeyRound className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium">{key.label}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {key.masked}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {key.connected ? (
                <Badge variant="success">Connected</Badge>
              ) : (
                <Badge variant="muted">Inactive</Badge>
              )}
              <Button variant="outline" size="sm">
                {key.connected ? "Rotate" : "Connect"}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const notificationPrefs = [
  {
    id: "n1",
    title: "Generation complete",
    desc: "Notify me when a long-running generation finishes.",
    on: true,
  },
  {
    id: "n2",
    title: "Project activity",
    desc: "Updates when teammates add to shared projects.",
    on: true,
  },
  {
    id: "n3",
    title: "Credit alerts",
    desc: "Warn me when I drop below 10% of monthly credits.",
    on: true,
  },
  {
    id: "n4",
    title: "Product updates",
    desc: "Occasional emails about new JENVERSE features.",
    on: false,
  },
];

function NotificationSettings() {
  const [prefs, setPrefs] = useState(notificationPrefs);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-border">
        {prefs.map((pref) => (
          <div
            key={pref.id}
            className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
          >
            <div className="pr-4">
              <p className="text-sm font-medium">{pref.title}</p>
              <p className="text-xs text-muted-foreground">{pref.desc}</p>
            </div>
            <Switch
              checked={pref.on}
              onCheckedChange={(checked) =>
                setPrefs((prev) =>
                  prev.map((p) =>
                    p.id === pref.id ? { ...p, on: checked } : p
                  )
                )
              }
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
