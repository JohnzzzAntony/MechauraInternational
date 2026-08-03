"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Eye, EyeOff, Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

interface SectionItem {
  id: string;
  label: string;
  order: number;
  visible: boolean;
}

function SortableSectionRow({
  section,
  onToggleVisible,
}: {
  section: SectionItem;
  onToggleVisible: (id: string, next: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between gap-4 rounded-xl border p-3.5 transition-all ${
        section.visible
          ? "border-border/70 bg-card shadow-sm"
          : "border-border/40 bg-muted/20 opacity-65"
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing p-1 rounded hover:bg-muted"
        >
          <GripVertical className="size-4" />
        </button>
        <div>
          <div className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span>{section.label}</span>
            {!section.visible && (
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                Hidden
              </span>
            )}
          </div>
          <div className="text-[11px] font-mono text-muted-foreground">id: #{section.id}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {section.visible ? (
            <Eye className="size-4 text-emerald-500" />
          ) : (
            <EyeOff className="size-4 text-muted-foreground" />
          )}
          <Switch
            checked={section.visible}
            onCheckedChange={(checked) => onToggleVisible(section.id, checked)}
          />
        </div>
      </div>
    </div>
  );
}

export function AdminSections() {
  const [sections, setSections] = React.useState<SectionItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchSections = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/content/sections");
      const data = await res.json();
      setSections(data);
    } catch (err) {
      console.error("Failed to load sections:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);
        return reordered.map((item, idx) => ({ ...item, order: idx }));
      });
    }
  };

  const handleToggleVisible = (id: string, next: boolean) => {
    setSections((items) =>
      items.map((item) => (item.id === id ? { ...item, visible: next } : item))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/content/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sections),
      });

      if (!res.ok) throw new Error("Failed to update layout");

      const updated = await res.json();
      setSections(updated);
      toast({ title: "Layout Saved", description: "Homepage section order & visibility updated." });
    } catch (err: any) {
      toast({
        title: "Save failed",
        description: err?.message || "Could not save layout settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        <RefreshCw className="size-5 animate-spin mr-2" />
        Loading Homepage section layout...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
            Homepage Layout & Visibility Manager
          </h2>
          <p className="text-xs text-muted-foreground">
            Drag to reorder homepage sections or toggle switches to show/hide sections instantly.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} variant="brand" className="gap-2">
          {saving ? (
            <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Save className="size-4" />
          )}
          Save Layout
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sections.map((section) => (
              <SortableSectionRow
                key={section.id}
                section={section}
                onToggleVisible={handleToggleVisible}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
