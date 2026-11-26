import { type WizardStep } from "./tripCreateState";

const steps: { step: WizardStep; label: string }[] = [
  { step: "DETAILS", label: "Trip details" },
  { step: "RESOURCES", label: "Vehicle & team" },
  { step: "ROUTE", label: "Route & confirmation" },
];

function StepBar({ current }: { current: WizardStep }) {
  return (
    <ol className="flex flex-col gap-2 sm:flex-row sm:gap-3">
      {steps.map(({ step, label }, index) => {
        const active = step === current;
        return (
          <li
            key={step}
            aria-current={active ? "step" : undefined}
            className={`flex flex-1 items-center gap-2 rounded-lg border px-4 py-2.5 text-sm ${
              active
                ? "border-primary bg-primary/10 font-semibold text-primary"
                : "border-slate-200 bg-white text-slate-500"
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                active ? "bg-primary text-white" : "bg-slate-200 text-slate-600"
              }`}
            >
              {index + 1}
            </span>
            {label}
          </li>
        );
      })}
    </ol>
  );
}

export default StepBar;
