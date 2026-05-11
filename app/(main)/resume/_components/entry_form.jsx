"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const defaultEntryForType = (type) => {
  if (type === "Experience") {
    return {
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      description: "",
    };
  }

  if (type === "Education") {
    return {
      school: "",
      degree: "",
      startDate: "",
      endDate: "",
      description: "",
    };
  }

  return {
    title: "",
    link: "",
    description: "",
  };
};

const getEntryFields = (type) => {
  if (type === "Experience") {
    return [
      { name: "company", label: "Company" },
      { name: "role", label: "Role" },
      { name: "startDate", label: "Start Date", placeholder: "e.g. Jan 2022" },
      { name: "endDate", label: "End Date", placeholder: "e.g. Present" },
      { name: "description", label: "Description", textarea: true },
    ];
  }

  if (type === "Education") {
    return [
      { name: "school", label: "School" },
      { name: "degree", label: "Degree" },
      { name: "startDate", label: "Start Date", placeholder: "e.g. Sep 2018" },
      { name: "endDate", label: "End Date", placeholder: "e.g. Jun 2022" },
      { name: "description", label: "Description", textarea: true },
    ];
  }

  return [
    { name: "title", label: "Project Title" },
    { name: "link", label: "Project Link", placeholder: "https://" },
    { name: "description", label: "Description", textarea: true },
  ];
};

const areEntriesEqual = (a = [], b = []) => {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;

  return a.every((item, index) => {
    const other = b[index];
    if (item === other) return true;
    if (typeof item !== "object" || item === null || typeof other !== "object" || other === null) {
      return item === other;
    }

    const keys = new Set([...Object.keys(item), ...Object.keys(other)]);
    return [...keys].every((key) => item[key] === other[key]);
  });
};

export function EntryForm({ type, entries = [], onChange }) {
  const [localEntries, setLocalEntries] = useState(entries ?? []);

  useEffect(() => {
    const nextEntries = entries ?? [];
    if (!areEntriesEqual(nextEntries, localEntries)) {
      setLocalEntries(nextEntries);
    }
  }, [entries, localEntries]);

  const notifyChange = (updatedEntries) => {
    if (typeof onChange === "function") {
      onChange(updatedEntries);
    }
  };

  const addEntry = () => {
    setLocalEntries((current) => {
      const next = [...current, defaultEntryForType(type)];
      notifyChange(next);
      return next;
    });
  };

  const updateEntry = (index, field, value) => {
    setLocalEntries((current) => {
      const next = current.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      );
      notifyChange(next);
      return next;
    });
  };

  const removeEntry = (index) => {
    setLocalEntries((current) => {
      const next = current.filter((_, idx) => idx !== index);
      notifyChange(next);
      return next;
    });
  };

  const fields = getEntryFields(type);

  return (
    <div className="space-y-4">
      {localEntries.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
          No {type.toLowerCase()} entries yet. Add one to start building your resume.
        </div>
      )}

      {localEntries.map((entry, index) => (
        <div key={index} className="rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4 pb-4">
            <h4 className="text-sm font-semibold">
              {type} Entry {index + 1}
            </h4>
            <Button
              type="button"
              variant="outline"
              className="h-8 px-3"
              onClick={() => removeEntry(index)}
            >
              Remove
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-medium">{field.label}</label>
                {field.textarea ? (
                  <Textarea
                    value={entry[field.name] || ""}
                    onChange={(event) =>
                      updateEntry(index, field.name, event.target.value)
                    }
                    placeholder={field.placeholder ?? `Enter ${field.label.toLowerCase()}`}
                    className="min-h-30"
                  />
                ) : (
                  <Input
                    value={entry[field.name] || ""}
                    onChange={(event) =>
                      updateEntry(index, field.name, event.target.value)
                    }
                    placeholder={field.placeholder ?? `Enter ${field.label.toLowerCase()}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addEntry}>
        Add {type} Entry
      </Button>
    </div>
  );
}
