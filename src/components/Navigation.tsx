import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Dumbbell, Brain, User, Home, Trophy } from "lucide-react";

export function Navigation() {
  const profile = useQuery(api.profiles.getProfile);

  return (
    <nav className="h-full w-64 bg-slate-50 border-r p-4">
      <div className="space-y-4">
        <NavItem icon={<Home size={20} />} label="Dashboard" isActive={true} />
        <NavItem icon={<Dumbbell size={20} />} label="Workouts" />
        <NavItem icon={<Brain size={20} />} label="NeuroFit" />
        <NavItem icon={<Trophy size={20} />} label="Achievements" />
        <NavItem icon={<User size={20} />} label="Profile" />
      </div>
      
      {profile && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="font-medium text-sm">{profile.name}</p>
            <p className="text-xs text-slate-500 capitalize">{profile.subscriptionStatus} Plan</p>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavItem({ icon, label, isActive = false }: { 
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}) {
  return (
    <button 
      className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors
        ${isActive 
          ? 'bg-indigo-50 text-indigo-700' 
          : 'hover:bg-slate-100 text-slate-700'}`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}
