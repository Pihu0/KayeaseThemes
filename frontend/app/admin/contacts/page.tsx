"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Mail,
  MailOpen,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search,
  Inbox,
  Clock,
  User,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Contact = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Parse structured details that the frontend prepends to the message body */
function parseDetails(message: string) {
  const lines = message.split("\n");
  const details: { label: string; value: string }[] = [];
  let bodyStartIdx = 0;

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(Building|Budget|Timeline|Brand):\s*(.+)$/);
    if (match) {
      details.push({ label: match[1], value: match[2] });
      bodyStartIdx = i + 1;
    } else {
      break;
    }
  }

  // Skip blank lines between details and the vision text
  while (bodyStartIdx < lines.length && lines[bodyStartIdx].trim() === "") {
    bodyStartIdx++;
  }

  const vision = lines.slice(bodyStartIdx).join("\n").trim();
  return { details, vision };
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    try {
      const data = await apiFetch("/contacts");
      setContacts(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await apiFetch(`/contacts/${id}`, { method: "DELETE" });
      setContacts((prev) => prev.filter((c) => c._id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch {
      // silent
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleRead = async (contact: Contact) => {
    try {
      await apiFetch(`/contacts/${contact._id}`, {
        method: "PATCH",
        body: JSON.stringify({ isRead: !contact.isRead }),
      });
      setContacts((prev) =>
        prev.map((c) =>
          c._id === contact._id ? { ...c, isRead: !c.isRead } : c
        )
      );
    } catch {
      // silent — backend may not have PATCH yet
    }
  };

  const filtered = contacts.filter((c) => {
    if (filter === "unread" && c.isRead) return false;
    if (filter === "read" && !c.isRead) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadCount = contacts.filter((c) => !c.isRead).length;

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight">Messages</h1>
            {unreadCount > 0 && (
              <Badge variant="default" className="tabular-nums">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Custom design requests and contact enquiries.
          </p>
        </div>
      </div>

      {/* Filters & search */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1.5">
          {(["all", "unread", "read"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === "all"
                ? `All (${contacts.length})`
                : f === "unread"
                  ? `Unread (${unreadCount})`
                  : `Read (${contacts.length - unreadCount})`}
            </Button>
          ))}
        </div>

        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search messages…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10"
          />
        </div>
      </div>

      {/* Messages list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <Inbox className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">
            {contacts.length === 0 ? "No messages yet" : "No messages match your filter"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            {contacts.length === 0
              ? "Custom design requests will appear here."
              : "Try adjusting your search or filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((contact) => {
            const isExpanded = expandedId === contact._id;
            const { details, vision } = parseDetails(contact.message);

            return (
              <div
                key={contact._id}
                className={cn(
                  "group rounded-xl border transition-all",
                  !contact.isRead
                    ? "border-foreground/15 bg-foreground/[0.02]"
                    : "border-border bg-card",
                  isExpanded && "ring-1 ring-foreground/10"
                )}
              >
                {/* Row header */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : contact._id)
                  }
                  className="flex w-full items-center gap-4 px-5 py-4 text-left"
                >
                  {/* Unread dot */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06]">
                    {!contact.isRead ? (
                      <Mail className="h-4 w-4 text-primary" />
                    ) : (
                      <MailOpen className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className={cn(
                          "truncate text-sm",
                          !contact.isRead ? "font-semibold" : "font-medium"
                        )}
                      >
                        {contact.name}
                      </p>
                      {!contact.isRead && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {contact.subject || "No subject"}
                    </p>
                  </div>

                  <div className="hidden shrink-0 items-center gap-3 sm:flex">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {timeAgo(contact.createdAt)}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-border px-5 py-5">
                    {/* Contact info */}
                    <div className="mb-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <User className="h-3.5 w-3.5" />
                        {contact.name}
                      </span>
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-1.5 text-primary underline-offset-4 hover:underline"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {contact.email}
                      </a>
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDate(contact.createdAt)}
                      </span>
                    </div>

                    {/* Structured project details (if any) */}
                    {details.length > 0 && (
                      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {details.map((d) => (
                          <div
                            key={d.label}
                            className="rounded-lg border border-border bg-background p-3"
                          >
                            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                              {d.label}
                            </p>
                            <p className="mt-1 text-sm font-medium">
                              {d.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Subject */}
                    {contact.subject && (
                      <div className="mb-3">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          Subject
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          {contact.subject}
                        </p>
                      </div>
                    )}

                    {/* Vision / message body */}
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {details.length > 0 ? "Vision" : "Message"}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">
                        {vision || contact.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleRead(contact)}
                      >
                        {contact.isRead ? (
                          <>
                            <Mail className="h-3.5 w-3.5" /> Mark unread
                          </>
                        ) : (
                          <>
                            <MailOpen className="h-3.5 w-3.5" /> Mark read
                          </>
                        )}
                      </Button>
                      <Button
                        render={
                          <a href={`mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject || "Your enquiry")}`} />
                        }
                        nativeButton={false}
                        variant="outline"
                        size="sm"
                      >
                        <Mail className="h-3.5 w-3.5" /> Reply
                      </Button>
                      <div className="flex-1" />
                      <Dialog>
                        <DialogTrigger
                          render={
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            />
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Message</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this message? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose render={<Button variant="outline" />}>
                              Cancel
                            </DialogClose>
                            <Button 
                              variant="destructive" 
                              onClick={() => handleDelete(contact._id)}
                              disabled={deleting === contact._id}
                            >
                              {deleting === contact._id ? "Deleting…" : "Delete"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
