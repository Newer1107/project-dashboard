"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addAllowedEmail, getAllowedEmails, removeAllowedEmail } from "@/server/actions/allowed-emails";
import { motion } from "framer-motion";
import { Plus, Trash2, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AllowedEmailsPage() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "allowed-emails"],
    queryFn: () => getAllowedEmails(),
  });

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      await addAllowedEmail({
        email,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      });
      setEmail("");
      setExpiresAt("");
      await queryClient.invalidateQueries({ queryKey: ["admin", "allowed-emails"] });
      toast.success("Allowed email saved");
    } catch (error: any) {
      toast.error(error?.message || "Failed to save email");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await removeAllowedEmail(id);
      await queryClient.invalidateQueries({ queryKey: ["admin", "allowed-emails"] });
      toast.success("Allowed email removed");
    } catch (error: any) {
      toast.error(error?.message || "Failed to remove email");
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Allowed Emails</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage manual email whitelist entries in addition to @tcetmumbai.in domain.
        </p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Add Whitelist Email
          </CardTitle>
          <CardDescription>
            Optional expiry lets temporary access auto-expire.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="allowedEmail">Email</Label>
              <Input
                id="allowedEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="external.reviewer@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry (optional)</Label>
              <Input
                id="expiry"
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
            <div className="md:col-span-3">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Save Email
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Whitelist Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading entries...</p>
          ) : (data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No custom allowed emails yet.</p>
          ) : (
            <div className="divide-y rounded-md border">
              {(data ?? []).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3">
                  <div>
                    <p className="font-medium">{entry.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.expiresAt
                        ? `Expires: ${new Date(entry.expiresAt).toLocaleString()}`
                        : "No expiry"}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
