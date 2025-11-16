// app/components/DownloadProcess.js
"use client";
import React, { useContext, useEffect, useState } from "react";
import { VideoDownloadContext } from "@/context/VideoDownloadContext";
import { Loader2, CheckCircle, XCircle, Clock, Download } from "lucide-react";

const DownloadProcess = () => {
    const { videoInfo, resetDownload, platform } = useContext(VideoDownloadContext);
    const [steps, setSteps] = useState([
        { id: "validation", label: "Validating URL", status: "processing" },
        { id: "fetching", label: "Fetching video info", status: "pending" },
        { id: "processing", label: "Processing video", status: "pending" },
        { id: "downloading", label: "Preparing download", status: "pending" },
    ]);
    const [countdown, setCountdown] = useState(null);
    const [downloadReady, setDownloadReady] = useState(false);

    useEffect(() => {
        const updateStepStatus = (stepId, status) => {
            setSteps((currentSteps) =>
                currentSteps.map((step) => (step.id === stepId ? { ...step, status } : step))
            );
        };

        const simulateProcess = async () => {
            await new Promise((r) => setTimeout(r, 1500));
            updateStepStatus("validation", "completed");

            updateStepStatus("fetching", "processing");
            await new Promise((r) => setTimeout(r, 2000));
            updateStepStatus("fetching", "completed");

            updateStepStatus("processing", "processing");
            await new Promise((r) => setTimeout(r, 2000));
            updateStepStatus("processing", "completed");

            updateStepStatus("downloading", "processing");
            await new Promise((r) => setTimeout(r, 1500));
            updateStepStatus("downloading", "completed");
            setCountdown(5);
        };

        simulateProcess();
    }, []);

    useEffect(() => {
        if (countdown === null) return;

        if (countdown <= 0) {
            setDownloadReady(true);
            return;
        }

        const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    const getStepIcon = (status) => {
        switch (status) {
            case "pending":
                return <Clock className="h-5 w-5 text-gray-400" />;
            case "processing":
                return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
            case "completed":
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case "failed":
                return <XCircle className="h-5 w-5 text-red-500" />;
        }
    };

    return (
        <div className="py-4 max-w-md mx-auto">
            <div className="space-y-4 mb-6">
                {steps.map((step) => (
                    <div key={step.id} className="flex items-center">
                        <div className="mr-3">{getStepIcon(step.status)}</div>
                        <div>
                            <div className="font-medium">{step.label}</div>
                            {step.id === "downloading" && step.status === "completed" && !downloadReady && (
                                <p className="text-sm text-gray-600">Download will be ready in {countdown}s...</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {downloadReady ? (
                <div className="text-center space-y-4">
                    <p className="text-green-700 font-medium">
                        Your {platform.charAt(0).toUpperCase() + platform.slice(1)} video is ready!
                    </p>
                    <a
                        href={videoInfo.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        <Download className="h-5 w-5" />
                        Click here to download
                    </a>
                    <button onClick={resetDownload} className="text-sm text-gray-600 hover:underline mt-2">
                        Start New Download
                    </button>
                </div>
            ) : (
                <div className="text-center">
                    <button onClick={resetDownload} className="text-sm text-gray-600 hover:underline">
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default DownloadProcess;