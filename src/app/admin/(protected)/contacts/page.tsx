import { db } from '@/lib/db';
import { AdminContactsManager } from '@/components/admin/AdminContactsManager';
import { AdminPeoplePanel } from '@/components/admin/AdminPeoplePanel';
import { requireAdminPageUser } from '@/server/auth/admin';

export const dynamic = 'force-dynamic';

type LeadWithNotes = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  source: string;
  locale: 'ES' | 'CA';
  status: string;
  createdAt: Date;
  notes: Array<{
    id: string;
    body: string;
    createdAt: Date;
  }>;
};

type StudyForPeople = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  method: string;
  kwConsumed: string | null;
  source: string;
  locale: 'ES' | 'CA';
  status: string;
  createdAt: Date;
};

type SubscriberForPeople = {
  id: string;
  email: string;
  fullName: string | null;
  locale: 'ES' | 'CA';
  isActive: boolean;
  source: string;
  consentedAt: Date | null;
  createdAt: Date;
  consents: Array<{
    id: string;
    legalText: string;
    acceptedAt: Date;
  }>;
  events: Array<{
    id: string;
    eventType: string;
    createdAt: Date;
    sendJob: {
      campaign: {
        name: string;
      };
    };
  }>;
};

type EmailLogForPeople = {
  id: string;
  destination: string;
  subject: string;
  status: string;
  createdAt: Date;
  sentAt: Date | null;
};

function buildPeopleSummary(params: {
  leads: LeadWithNotes[];
  studies: StudyForPeople[];
  subscribers: SubscriberForPeople[];
  emailLogs: EmailLogForPeople[];
}) {
  const people = new Map<
    string,
    {
      id: string;
      email: string;
      displayName: string;
      phones: Set<string>;
      companies: Set<string>;
      locales: Set<string>;
      sources: Set<string>;
      leadCount: number;
      studyCount: number;
      hasSubscriber: boolean;
      subscriberStatus: 'ACTIVE' | 'INACTIVE' | 'NONE';
      consentedAt: string | null;
      lastActivityAt: string;
      timeline: Array<{ id: string; type: string; title: string; detail: string; at: string }>;
    }
  >();

  const ensurePerson = (email: string, fallbackName: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = people.get(normalizedEmail);
    if (existing) return existing;

    const created = {
      id: normalizedEmail,
      email: normalizedEmail,
      displayName: fallbackName || normalizedEmail,
      phones: new Set<string>(),
      companies: new Set<string>(),
      locales: new Set<string>(),
      sources: new Set<string>(),
      leadCount: 0,
      studyCount: 0,
      hasSubscriber: false,
      subscriberStatus: 'NONE' as const,
      consentedAt: null,
      lastActivityAt: new Date(0).toISOString(),
      timeline: [],
    };

    people.set(normalizedEmail, created);
    return created;
  };

  const pushTimeline = (
    person: ReturnType<typeof ensurePerson>,
    item: { id: string; type: string; title: string; detail: string; at: string }
  ) => {
    person.timeline.push(item);
    if (item.at > person.lastActivityAt) {
      person.lastActivityAt = item.at;
    }
  };

  for (const lead of params.leads) {
    const person = ensurePerson(lead.email, lead.name);
    person.displayName = person.displayName === person.email ? lead.name : person.displayName;
    if (lead.phone) person.phones.add(lead.phone);
    person.locales.add(lead.locale);
    person.sources.add(lead.source);
    person.leadCount += 1;
    pushTimeline(person, {
      id: `lead-${lead.id}`,
      type: 'lead',
      title: `Lead ${lead.status}`,
      detail: lead.subject || lead.message.slice(0, 140),
      at: lead.createdAt.toISOString(),
    });

    for (const note of lead.notes) {
      pushTimeline(person, {
        id: `lead-note-${note.id}`,
        type: 'note',
        title: 'Nota comercial',
        detail: note.body,
        at: note.createdAt.toISOString(),
      });
    }
  }

  for (const study of params.studies) {
    const person = ensurePerson(study.email, study.name);
    person.displayName = person.displayName === person.email ? study.name : person.displayName;
    if (study.phone) person.phones.add(study.phone);
    if (study.company) person.companies.add(study.company);
    person.locales.add(study.locale);
    person.sources.add(study.source);
    person.studyCount += 1;
    pushTimeline(person, {
      id: `study-${study.id}`,
      type: 'study',
      title: `Solicitud ${study.status}`,
      detail: `${study.method}${study.kwConsumed ? ` · ${study.kwConsumed}` : ''}`,
      at: study.createdAt.toISOString(),
    });
  }

  for (const subscriber of params.subscribers) {
    const person = ensurePerson(subscriber.email, subscriber.fullName || subscriber.email);
    if (subscriber.fullName) {
      person.displayName = subscriber.fullName;
    }
    person.locales.add(subscriber.locale);
    person.sources.add(subscriber.source);
    person.hasSubscriber = true;
    person.subscriberStatus = subscriber.isActive ? 'ACTIVE' : 'INACTIVE';
    person.consentedAt = subscriber.consentedAt?.toISOString() || person.consentedAt;

    pushTimeline(person, {
      id: `subscriber-${subscriber.id}`,
      type: 'subscriber',
      title: subscriber.isActive ? 'Suscriptor activo' : 'Suscriptor inactivo',
      detail: `Alta en newsletter desde ${subscriber.source}`,
      at: subscriber.createdAt.toISOString(),
    });

    for (const consent of subscriber.consents) {
      pushTimeline(person, {
        id: `consent-${consent.id}`,
        type: 'consent',
        title: 'Consentimiento registrado',
        detail: consent.legalText,
        at: consent.acceptedAt.toISOString(),
      });
    }

    for (const event of subscriber.events) {
      pushTimeline(person, {
        id: `event-${event.id}`,
        type: 'newsletter',
        title: `Evento ${event.eventType}`,
        detail: event.sendJob.campaign.name,
        at: event.createdAt.toISOString(),
      });
    }
  }

  for (const log of params.emailLogs) {
    const email = log.destination.trim().toLowerCase();
    if (!people.has(email)) continue;
    const person = people.get(email)!;
    pushTimeline(person, {
      id: `emaillog-${log.id}`,
      type: 'email',
      title: `Email ${log.status}`,
      detail: log.subject,
      at: (log.sentAt || log.createdAt).toISOString(),
    });
  }

  return Array.from(people.values())
    .map((person) => ({
      ...person,
      phones: Array.from(person.phones),
      companies: Array.from(person.companies),
      locales: Array.from(person.locales),
      sources: Array.from(person.sources),
      timeline: [...person.timeline]
        .sort((left, right) => right.at.localeCompare(left.at))
        .slice(0, 20),
    }))
    .sort((left, right) => right.lastActivityAt.localeCompare(left.lastActivityAt));
}

export default async function AdminContactsPage() {
  await requireAdminPageUser('ADMIN');

  const [leads, studies, subscribers, campaigns, emailLogs] = await Promise.all([
    db.lead.findMany({
      include: {
        notes: {
          include: { adminUser: { select: { username: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
      take: 200,
    }),
    db.studyRequest.findMany({ orderBy: [{ createdAt: 'desc' }], take: 200 }),
    db.subscriber.findMany({
      include: {
        consents: { orderBy: { acceptedAt: 'desc' }, take: 5 },
        events: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { sendJob: { include: { campaign: true } } },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
      take: 200,
    }),
    db.campaign.findMany({ orderBy: [{ updatedAt: 'desc' }], take: 20 }),
    db.emailLog.findMany({ orderBy: [{ createdAt: 'desc' }], take: 40 }),
  ]);

  const people = buildPeopleSummary({ leads, studies, subscribers, emailLogs });

  return (
    <div className="space-y-6">
      <AdminPeoplePanel initialPeople={people} />
      <AdminContactsManager
        initialLeads={leads.map((lead) => ({
          ...lead,
          createdAt: lead.createdAt.toISOString(),
          updatedAt: lead.updatedAt.toISOString(),
          contactedAt: lead.contactedAt?.toISOString() || null,
          wonAt: lead.wonAt?.toISOString() || null,
          lostAt: lead.lostAt?.toISOString() || null,
          notes: lead.notes.map((note) => ({
            ...note,
            createdAt: note.createdAt.toISOString(),
            updatedAt: note.updatedAt.toISOString(),
          })),
        }))}
        initialStudies={studies.map((study) => ({
          ...study,
          createdAt: study.createdAt.toISOString(),
          updatedAt: study.updatedAt.toISOString(),
          reviewedAt: study.reviewedAt?.toISOString() || null,
          quotedAt: study.quotedAt?.toISOString() || null,
          wonAt: study.wonAt?.toISOString() || null,
          lostAt: study.lostAt?.toISOString() || null,
        }))}
        initialSubscribers={subscribers.map((subscriber) => ({
          ...subscriber,
          consentedAt: subscriber.consentedAt?.toISOString() || null,
          unsubscribedAt: subscriber.unsubscribedAt?.toISOString() || null,
          createdAt: subscriber.createdAt.toISOString(),
          updatedAt: subscriber.updatedAt.toISOString(),
          consents: subscriber.consents.map((consent) => ({
            ...consent,
            acceptedAt: consent.acceptedAt.toISOString(),
          })),
          events: subscriber.events.map((event) => ({
            ...event,
            createdAt: event.createdAt.toISOString(),
            sendJob: {
              ...event.sendJob,
              runAt: event.sendJob.runAt.toISOString(),
              finishedAt: event.sendJob.finishedAt?.toISOString() || null,
              createdAt: event.sendJob.createdAt.toISOString(),
              updatedAt: event.sendJob.updatedAt.toISOString(),
              campaign: {
                ...event.sendJob.campaign,
                scheduledFor: event.sendJob.campaign.scheduledFor?.toISOString() || null,
                sentAt: event.sendJob.campaign.sentAt?.toISOString() || null,
                createdAt: event.sendJob.campaign.createdAt.toISOString(),
                updatedAt: event.sendJob.campaign.updatedAt.toISOString(),
              },
            },
          })),
        }))}
        recentCampaigns={campaigns.map((campaign) => ({
          ...campaign,
          scheduledFor: campaign.scheduledFor?.toISOString() || null,
          sentAt: campaign.sentAt?.toISOString() || null,
          createdAt: campaign.createdAt.toISOString(),
          updatedAt: campaign.updatedAt.toISOString(),
        }))}
        recentEmailLogs={emailLogs.map((log) => ({
          ...log,
          sentAt: log.sentAt?.toISOString() || null,
          createdAt: log.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
