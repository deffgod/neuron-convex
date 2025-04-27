import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function Dashboard() {
  const profile = useQuery(api.profiles.getProfile);
  const neuroProfile = useQuery(api.neuro.getNeuroProfile);
  const progress = useQuery(api.progress.getUserProgress);

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Welcome back, {profile.name}!</h1>
        <p className="text-slate-600">Here's your fitness and cognitive progress</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Workouts Completed"
          value={progress?.metrics.totalWorkouts ?? 0}
          unit="sessions"
        />
        <StatCard
          title="Active Minutes"
          value={progress?.metrics.totalMinutes ?? 0}
          unit="minutes"
        />
        <StatCard
          title="Current Streak"
          value={progress?.metrics.streakDays ?? 0}
          unit="days"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Fitness Progress</h2>
          <div className="space-y-3">
            <ProgressBar label="Weekly Goal" progress={75} />
            <ProgressBar label="Monthly Goal" progress={60} />
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Cognitive Metrics</h2>
          <div className="space-y-3">
            <ProgressBar 
              label="Focus Score" 
              progress={neuroProfile?.focusScore ?? 0} 
            />
            <ProgressBar 
              label="Memory Score" 
              progress={neuroProfile?.memoryScore ?? 0} 
            />
            <ProgressBar 
              label="Reaction Time" 
              progress={neuroProfile?.reactionTime ?? 0} 
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, unit }: { 
  title: string; 
  value: number; 
  unit: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <p className="text-sm text-slate-600">{title}</p>
      <p className="text-2xl font-bold mt-1">
        {value} <span className="text-sm font-normal text-slate-500">{unit}</span>
      </p>
    </div>
  );
}

function ProgressBar({ label, progress }: { label: string; progress: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
