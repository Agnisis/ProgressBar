import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = ["Started", "Planning", "Developing", "Executing", "Complete"];

export default function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const percentage =
      activeStep >= steps.length
        ? 100
        : Math.floor((activeStep / (steps.length - 1)) * 100);
    setProgress(percentage);

    if (activeStep === steps.length) {
      setShowPopup(true);
      const timer = setTimeout(() => setShowPopup(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [activeStep]);

  const handleNext = () => {
    if (activeStep < steps.length) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    setActiveStep(0);
    setProgress(0);
    setShowPopup(false);
  };

  const radius = 70;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center px-4 pt-24 pb-10 relative">
      {/* Circular Progress Top Right */}
      <div className="absolute top-4 right-4">
        <svg height={radius * 2} width={radius * 2}>
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <motion.circle
            stroke={activeStep === steps.length ? "#22c55e" : "#3b82f6"}
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".3em"
            className={`${
              activeStep === steps.length ? "text-green-600" : "text-blue-700"
            } text-2xl font-bold transition-all duration-500`}
          >
            {activeStep === steps.length ? "✓" : `${progress}%`}
          </text>
        </svg>
      </div>

      <h1 className="text-2xl font-semibold text-blue-900 mb-6">
        Project Progress
      </h1>

      {/* Horizontal Progress */}
      <div className="w-full max-w-2xl px-6 py-10">
        <div className="relative w-full h-20 bg-blue rounded-full mb-16 overflow-hidden">
          <motion.div
            className={`absolute top-9 left-0 h-1 ${
              activeStep === steps.length ? "bg-green-500" : "bg-blue-500"
            } rounded-full`}
            initial={{ width: 0 }}
            animate={{
              width: `${(activeStep / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
            {steps.map((_, idx) => {
              const isCompleted = idx < activeStep;
              const isLastStep = activeStep === steps.length;

              return (
                <motion.div
                  key={idx}
                  className={`w-12 h-12 z-10 rounded-full flex items-center justify-center border-2 shadow-md
                    ${
                      isCompleted || isLastStep
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-white border-blue-300 text-blue-300"
                    }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 10 }}
                >
                  <AnimatePresence mode="wait">
                    {activeStep === idx && !isLastStep ? (
                      <motion.span
                        key="emoji"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        😊
                      </motion.span>
                    ) : isCompleted || isLastStep ? (
                      <motion.span
                        key="tick"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                      >
                        ✓
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Labels */}
        <div className="flex justify-between text-sm text-blue-700 px-2">
          {steps.map((label, idx) => (
            <p key={idx}>{label}</p>
          ))}
        </div>

        {/* Step Info */}
        {activeStep < steps.length && (
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10 text-center text-blue-900 text-lg"
          >
            You are at <strong>{steps[activeStep]}</strong>
          </motion.div>
        )}

        {/* Next / Submit Button */}
        {activeStep < steps.length && (
          <button
            onClick={handleNext}
            className={`mt-6 ${
              activeStep === steps.length - 1
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white px-5 py-2 rounded-full shadow`}
          >
            {activeStep === steps.length - 1 ? "Submit" : "Next"}
          </button>
        )}

        {/* Restart Button */}
        {activeStep === steps.length && (
          <button
            onClick={handleRestart}
            className="mt-6 bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-full shadow"
          >
            Restart
          </button>
        )}
      </div>

      {/* Completed Popup */}
      {showPopup && (
        <AnimatePresence>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-10 rounded-xl shadow-xl text-center">
              <p className="text-green-600 text-2xl font-bold">🎉 Completed!</p>
              <p className="text-blue-800 mt-2">
                All steps successfully finished.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
