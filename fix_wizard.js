const fs = require('fs');
const filepath = '/home/asanchez/webtenseEnergy/src/components/ui/EnergyAuditWizard.tsx';
let data = fs.readFileSync(filepath, 'utf8');

// Replace dark mode specific classes to adapt to light/dark unified classes
data = data.replace(/bg-zinc-900(?=[\s"'])/g, "bg-white dark:bg-zinc-900");
data = data.replace(/bg-zinc-950(?=[\s"'])/g, "bg-zinc-50 dark:bg-zinc-950");
data = data.replace(/bg-zinc-800(?=[\s"'])/g, "bg-zinc-100 dark:bg-zinc-800");

data = data.replace(/border-zinc-800(?=[\s"'])/g, "border-zinc-200 dark:border-zinc-800");
data = data.replace(/border-zinc-700(?=[\s"'])/g, "border-zinc-300 dark:border-zinc-700");
data = data.replace(/border-white\/10(?=[\s"'])/g, "border-zinc-200 dark:border-white/10");

data = data.replace(/text-white(?=[\s"'])/g, "text-foreground");
data = data.replace(/text-zinc-300(?=[\s"'])/g, "text-foreground/80 dark:text-zinc-300");
data = data.replace(/text-zinc-400(?=[\s"'])/g, "text-foreground/70 dark:text-zinc-400");
data = data.replace(/text-zinc-500(?=[\s"'])/g, "text-foreground/60 dark:text-zinc-500");

fs.writeFileSync(filepath, data);
