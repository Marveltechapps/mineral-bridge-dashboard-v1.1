import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Card, CardContent } from "../ui/card";
import { MineralForm } from "./minerals/MineralForm";
import { Mineral } from "./minerals/types";
import { useDashboardStore } from "../../store/dashboardStore";

export interface MineralFormPageProps {
  /** When set, edit this mineral; when undefined, add new. */
  mineralId?: string;
  onBack: () => void;
  /** Called after successful create or update. */
  onSuccess: () => void;
}

export function MineralFormPage({ mineralId, onBack, onSuccess }: MineralFormPageProps) {
  const { state, dispatch } = useDashboardStore();
  const mineral = mineralId ? state.minerals.find((m) => m.id === mineralId) : undefined;
  const isEdit = !!mineral;

  const handleSubmit = (data: Omit<Mineral, "id" | "createdAt">) => {
    if (isEdit && mineral) {
      dispatch({ type: "UPDATE_MINERAL", payload: { ...mineral, ...data } });
    } else {
      const newMineral: Mineral = {
        ...data,
        id: `MIN-${String(state.minerals.length + 1).padStart(3, "0")}`,
        createdAt: new Date(),
      };
      dispatch({ type: "ADD_MINERAL", payload: newMineral });
    }
    onSuccess();
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button
                type="button"
                onClick={onBack}
                className="text-xs font-medium text-muted-foreground hover:text-emerald-600 transition-colors"
              >
                Buy Management
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-xs font-medium text-slate-900 dark:text-white">
              {isEdit ? `Edit: ${mineral?.name ?? mineralId}` : "Add New Mineral"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header - same style as other detail pages */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-6 py-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          {isEdit ? "Edit Mineral" : "Add New Mineral"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isEdit && mineral
            ? `${mineral.id} · Update listing details below`
            : "Complete the details below to list a new mineral in the catalog."}
        </p>
      </div>

      <Card className="border-none shadow-sm overflow-hidden min-h-0">
        <CardContent className="p-0 min-h-[70vh] flex flex-col">
          <MineralForm
            initialData={mineral}
            onSubmit={handleSubmit}
            onCancel={onBack}
          />
        </CardContent>
      </Card>
    </div>
  );
}
