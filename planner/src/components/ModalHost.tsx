'use client';

import { usePlanner } from './PlannerContext';
import { PostEditorModal } from './PostEditorModal';
import { PlanMyWeekModal } from './PlanMyWeekModal';
import { AIStudioModal } from './AIStudioModal';

export function ModalHost() {
  const { editing, planOpen, genOpen } = usePlanner();
  if (editing) return <PostEditorModal />;
  if (planOpen) return <PlanMyWeekModal />;
  if (genOpen) return <AIStudioModal />;
  return null;
}
