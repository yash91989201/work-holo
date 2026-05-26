import {
  IconFile,
  IconFolder,
  IconSearch,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import { Button } from "@work-holo/ui/components/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@work-holo/ui/components/command";
import { Kbd } from "@work-holo/ui/components/kbd";
import type { ComponentType } from "react";
import { useState } from "react";

type SearchItem = {
  id: string;
  title: string;
  description?: string;
  icon: ComponentType<{ className?: string }>;
};

type SearchCategory = {
  category: string;
  items: SearchItem[];
};

const searchData: SearchCategory[] = [
  {
    category: "Pages",
    items: [
      { id: "1", title: "Dashboard", icon: IconFolder },
      { id: "2", title: "Attendance", icon: IconFolder },
      { id: "3", title: "Team Members", icon: IconFolder },
      { id: "4", title: "Analytics", icon: IconFolder },
    ],
  },
  {
    category: "Members",
    items: [
      {
        id: "5",
        title: "John Doe",
        description: "Engineering",
        icon: IconUser,
      },
      { id: "6", title: "Jane Smith", description: "Design", icon: IconUser },
      {
        id: "7",
        title: "Mike Johnson",
        description: "Marketing",
        icon: IconUser,
      },
      {
        id: "8",
        title: "Sarah Williams",
        description: "Sales",
        icon: IconUser,
      },
    ],
  },
  {
    category: "Documents",
    items: [
      { id: "9", title: "Q4 Report.pdf", icon: IconFile },
      { id: "10", title: "Team Guidelines.md", icon: IconFile },
      { id: "11", title: "Project Roadmap.xlsx", icon: IconFile },
    ],
  },
  {
    category: "Teams",
    items: [
      {
        id: "12",
        title: "Engineering",
        description: "12 members",
        icon: IconUsers,
      },
      { id: "13", title: "Design", description: "8 members", icon: IconUsers },
      {
        id: "14",
        title: "Marketing",
        description: "6 members",
        icon: IconUsers,
      },
    ],
  },
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="relative h-9 w-full justify-start text-muted-foreground sm:w-64 sm:pr-12"
        onClick={() => setOpen(true)}
        variant="outline"
      >
        <IconSearch className="mr-2 size-4" />
        <span className="inline-flex">Search...</span>
        <Kbd className="pointer-events-none absolute top-1/2 right-1.5 hidden -translate-y-1/2 sm:inline-flex">
          ⌘K
        </Kbd>
      </Button>
      <CommandDialog onOpenChange={setOpen} open={open}>
        <CommandInput placeholder="Type to search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {searchData.map((group) => (
            <CommandGroup heading={group.category} key={group.category}>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.id}
                    onSelect={() => {
                      setOpen(false);
                    }}
                  >
                    <Icon className="mr-2 size-4" />
                    <span>{item.title}</span>
                    {item.description && (
                      <span className="ml-auto text-muted-foreground text-xs">
                        {item.description}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
