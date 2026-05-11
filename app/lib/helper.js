export const entriesToMarkdown = (entries, title) => {
  if (!Array.isArray(entries) || entries.length === 0) {
    return "";
  }

  const formattedEntries = entries
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return "";
      }

      const isExperience = entry.company || entry.role;
      const isEducation = entry.school || entry.degree;

      if (isExperience) {
        const heading = [entry.role, entry.company].filter(Boolean).join(" at ");
        const dates = [entry.startDate, entry.endDate]
          .filter(Boolean)
          .join(" — ");

        return [
          `### ${heading}`.trim(),
          dates || "",
          entry.description || "",
        ]
          .filter(Boolean)
          .join("\n\n");
      }

      if (isEducation) {
        const heading = [entry.degree, entry.school]
          .filter(Boolean)
          .join(", ");
        const dates = [entry.startDate, entry.endDate]
          .filter(Boolean)
          .join(" — ");

        return [
          `### ${heading}`.trim(),
          dates || "",
          entry.description || "",
        ]
          .filter(Boolean)
          .join("\n\n");
      }

      return [
        `### ${entry.title || "Project"}`.trim(),
        entry.link ? `[Project Link](${entry.link})` : "",
        entry.description || "",
      ]
        .filter(Boolean)
        .join("\n\n");
    })
    .filter(Boolean);

  if (formattedEntries.length === 0) {
    return "";
  }

  return [`## ${title}`, ...formattedEntries].join("\n\n");
};
