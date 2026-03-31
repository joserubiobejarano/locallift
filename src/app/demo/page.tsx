"use client";

import { useEffect } from "react";
import { createDemoSession } from "@/lib/demo-actions";

export default function DemoPage() {
    useEffect(() => {
        // Automatically trigger demo session creation
        createDemoSession();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <div className="h-12 w-12 rounded-full border-4 border-slate-700 border-t-purple-500 animate-spin" />
                </div>
                <h1 className="text-2xl font-semibold">Entering demo mode...</h1>
                <p className="text-slate-400">Setting up your demo experience</p>
            </div>
        </div>
    );
}
