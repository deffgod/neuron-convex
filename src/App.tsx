import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "./components/ui/toaster";
import { DashboardLayout } from "./components/DashboardLayout";
import { Dashboard } from "./components/Dashboard";
import Onboard from "./components/onboard";
import FitnessPlanDemo from "./components/FitnesPlan";
import NeuronlinePlatform from "./components/dash";
import Progress from "./components/Progress";
import Neurotest from "./components/neurotest";
import WorkoutLibrary from "./components/VideoStore"


export default function App() {
  return (
    <>
      <Authenticated>
        <WorkoutLibrary />
        <Neurotest />
        <Progress />
        <NeuronlinePlatform />
       < FitnessPlanDemo />
      <Onboard />
      </Authenticated>
      
      <Unauthenticated>
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm  flex justify-between items-center border-b">
            <h2 className="text-xl font-semibold accent-text">Neuronline</h2>
          </header>
          <main className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold accent-text mb-4">Neuronline</h1>
                <p className="text-xl text-slate-600">
                 Начните свое путешествие в мир нейрофизиологии и спорта
                </p>
              </div >
              <SignInForm/>
            </div>
          </main>
        </div>
      </Unauthenticated>
      <Toaster />
    </>
  );
}
