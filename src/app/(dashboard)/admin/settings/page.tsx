"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success("Settings saved (demo)");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configure system-wide settings
        </p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Basic system configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>Institution Name</Label>
              <Input defaultValue="University Dashboard" />
            </div>
            <div className="space-y-2">
              <Label>Admin Email</Label>
              <Input type="email" defaultValue="admin@university.edu" />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Max File Upload Size (MB)</Label>
              <Input type="number" defaultValue={50} min={1} max={500} />
            </div>
            <div className="space-y-2">
              <Label>Default Max Group Size</Label>
              <Input type="number" defaultValue={4} min={1} max={10} />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>SMTP configuration for system emails</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>SMTP Host</Label>
                <Input placeholder="smtp.gmail.com" />
              </div>
              <div className="space-y-2">
                <Label>SMTP Port</Label>
                <Input type="number" placeholder="587" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>SMTP User</Label>
                <Input placeholder="user@gmail.com" />
              </div>
              <div className="space-y-2">
                <Label>SMTP Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
            </div>
            <Button type="submit">Save Email Settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
