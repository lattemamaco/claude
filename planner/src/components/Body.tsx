'use client';

import { usePlanner } from './PlannerContext';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { IdeasView } from './IdeasView';

export function Body() {
  const { view } = usePlanner();
  if (view === 'month') return <MonthView />;
  if (view === 'week') return <WeekView />;
  if (view === 'day') return <DayView />;
  return <IdeasView />;
}
