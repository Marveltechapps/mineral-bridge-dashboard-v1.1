import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Mineral, initialMineralState } from "./types";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Switch } from "../../ui/switch";
import { Checkbox } from "../../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";
import { Upload, X, Plus, Info, ChevronDown, ChevronUp, Calendar, Hash, Pencil, Check } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { format } from "date-fns";

const DEFAULT_CATEGORY_OPTIONS = ["Precious metals", "Base metals", "Energy minerals", "Other"] as const;

interface MineralFormProps {
  initialData?: Mineral;
  onSubmit: (data: Omit<Mineral, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  /** Product categories from catalog (same as Mineral categories card). Defaults to Precious metals, Base metals, Energy minerals, Other. */
  categoryOptions?: string[];
}

const VISIBLE_TO_OPTIONS = ["Buyers", "Institutions", "Artisanal"] as const;
const INSTITUTIONAL_BUYER_CATEGORY_OPTIONS = ["Institutional Buyer", "Large-Scale Buyer", "Retail Buyer", "Artisanal Collector", "Corporate Buyer"] as const;
const MINERAL_TYPE_OPTIONS = ["Lithium", "Cobalt", "Copper", "Nickel", "Graphite", "Manganese", "Rare Earth"] as const;
const BADGE_OPTIONS = ["Verified Batch", "Artisanal Source", "Compliance Cleared"] as const;

const SECTION_TITLES = {
  basic: "1. Mineral Name",
  productDescription: "2. Product description",
  media: "3. Media (Hero Section)",
  classification: "4. Classification & Badges",
  origin: "5. Origin Details",
  purity: "6. Purity & Quality",
  dueDiligence: "7. Due Diligence",
  allocation: "8. Allocation & Availability",
  pricing: "9. Pricing (Internal)",
  compliance: "10. Compliance & Visibility",
  cta: "11. Primary CTA Mapping",
  status: "12. Verification Status"
};

export function MineralForm({ initialData, onSubmit, onCancel, categoryOptions = [...DEFAULT_CATEGORY_OPTIONS] }: MineralFormProps) {
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<Omit<Mineral, 'id' | 'createdAt'>>({
    defaultValues: initialData || initialMineralState
  });

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true,
    productDescription: true,
    media: true,
    classification: true,
    origin: true,
    purity: true,
    dueDiligence: false,
    allocation: false,
    pricing: false,
    compliance: false,
    cta: false,
    status: true
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Helper for badges and tags
  const [tagInput, setTagInput] = useState("");
  const [otherCategoryInput, setOtherCategoryInput] = useState("");
  const [showOthersCategoryInput, setShowOthersCategoryInput] = useState(false);
  const [customVisibleToInput, setCustomVisibleToInput] = useState("");
  const [editingVisibleTo, setEditingVisibleTo] = useState<string | null>(null);
  const [editingVisibleToDraft, setEditingVisibleToDraft] = useState("");
  const [editingInstitutional, setEditingInstitutional] = useState<string | null>(null);
  const [editingInstitutionalDraft, setEditingInstitutionalDraft] = useState("");
  const [editingMineralType, setEditingMineralType] = useState<string | null>(null);
  const [editingMineralTypeDraft, setEditingMineralTypeDraft] = useState("");
  const [customMineralTypeInput, setCustomMineralTypeInput] = useState("");
  const [addMineralTypeSelect, setAddMineralTypeSelect] = useState("");
  const [addVisibleToSelect, setAddVisibleToSelect] = useState("");
  const [addInstitutionalSelect, setAddInstitutionalSelect] = useState("");
  const [addBadgeSelect, setAddBadgeSelect] = useState("");
  const [customBadgeInput, setCustomBadgeInput] = useState("");
  const [editingBadge, setEditingBadge] = useState<string | null>(null);
  const [editingBadgeDraft, setEditingBadgeDraft] = useState("");
  const [additionalImageUrlInput, setAdditionalImageUrlInput] = useState("");
  const heroFileInputRef = useRef<HTMLInputElement | null>(null);
  const additionalFilesInputRef = useRef<HTMLInputElement | null>(null);
  const tags = watch("tags");

  useEffect(() => {
    const cats = initialData?.institutionalBuyerCategories ?? [];
    if (cats.some((c: string) => !INSTITUTIONAL_BUYER_CATEGORY_OPTIONS.includes(c))) {
      setShowOthersCategoryInput(true);
    }
  }, [initialData?.institutionalBuyerCategories]);
  const badges = watch("badges");

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setValue("tags", [...tags, tagInput]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setValue("tags", tags.filter(t => t !== tag));
  };

  const visibleTo = watch("visibleTo") || [];
  const institutionalBuyerCategories = watch("institutionalBuyerCategories") || [];
  const mineralTypes = watch("mineralTypes") || [];

  const addOtherCategory = () => {
    const value = otherCategoryInput.trim();
    if (value && !institutionalBuyerCategories.includes(value)) {
      setValue("institutionalBuyerCategories", [...institutionalBuyerCategories, value]);
      setOtherCategoryInput("");
    }
  };

  const addCustomVisibleTo = () => {
    const value = customVisibleToInput.trim();
    if (value && !visibleTo.includes(value)) {
      setValue("visibleTo", [...visibleTo, value]);
      setCustomVisibleToInput("");
    }
  };

  const removeVisibleTo = (item: string) => {
    setValue("visibleTo", visibleTo.filter((v: string) => v !== item));
    if (editingVisibleTo === item) setEditingVisibleTo(null);
  };

  const removeInstitutionalCategory = (item: string) => {
    setValue("institutionalBuyerCategories", institutionalBuyerCategories.filter((v: string) => v !== item));
    if (editingInstitutional === item) setEditingInstitutional(null);
  };

  const addVisibleToOption = (option: string) => {
    if (!visibleTo.includes(option)) setValue("visibleTo", [...visibleTo, option]);
  };

  const addInstitutionalOption = (option: string) => {
    if (!institutionalBuyerCategories.includes(option)) setValue("institutionalBuyerCategories", [...institutionalBuyerCategories, option]);
  };

  const startEditVisibleTo = (item: string) => {
    setEditingVisibleTo(item);
    setEditingVisibleToDraft(item);
  };

  const saveEditVisibleTo = () => {
    if (editingVisibleTo == null) return;
    const draft = editingVisibleToDraft.trim();
    if (draft && draft !== editingVisibleTo) {
      const next = visibleTo.map((v: string) => (v === editingVisibleTo ? draft : v));
      setValue("visibleTo", next);
    }
    setEditingVisibleTo(null);
  };

  const startEditInstitutional = (item: string) => {
    setEditingInstitutional(item);
    setEditingInstitutionalDraft(item);
  };

  const saveEditInstitutional = () => {
    if (editingInstitutional == null) return;
    const draft = editingInstitutionalDraft.trim();
    if (draft && draft !== editingInstitutional) {
      const next = institutionalBuyerCategories.map((v: string) => (v === editingInstitutional ? draft : v));
      setValue("institutionalBuyerCategories", next);
    }
    setEditingInstitutional(null);
  };

  const addMineralTypeOption = (option: string) => {
    if (!mineralTypes.includes(option)) setValue("mineralTypes", [...mineralTypes, option]);
  };

  const addCustomMineralType = () => {
    const value = customMineralTypeInput.trim();
    if (value && !mineralTypes.includes(value)) {
      setValue("mineralTypes", [...mineralTypes, value]);
      setCustomMineralTypeInput("");
    }
  };

  const removeMineralType = (item: string) => {
    setValue("mineralTypes", mineralTypes.filter((v: string) => v !== item));
    if (editingMineralType === item) setEditingMineralType(null);
  };

  const startEditMineralType = (item: string) => {
    setEditingMineralType(item);
    setEditingMineralTypeDraft(item);
  };

  const saveEditMineralType = () => {
    if (editingMineralType == null) return;
    const draft = editingMineralTypeDraft.trim();
    if (draft && draft !== editingMineralType) {
      const next = mineralTypes.map((v: string) => (v === editingMineralType ? draft : v));
      setValue("mineralTypes", next);
    }
    setEditingMineralType(null);
  };

  const addBadgeOption = (option: string) => {
    if (!badges.includes(option)) setValue("badges", [...badges, option]);
  };

  const addCustomBadge = () => {
    const value = customBadgeInput.trim();
    if (value && !badges.includes(value)) {
      setValue("badges", [...badges, value]);
      setCustomBadgeInput("");
    }
  };

  const removeBadge = (item: string) => {
    setValue("badges", badges.filter((v: string) => v !== item));
    if (editingBadge === item) setEditingBadge(null);
  };

  const startEditBadge = (item: string) => {
    setEditingBadge(item);
    setEditingBadgeDraft(item);
  };

  const saveEditBadge = () => {
    if (editingBadge == null) return;
    const draft = editingBadgeDraft.trim();
    if (draft && draft !== editingBadge) {
      const next = badges.map((v: string) => (v === editingBadge ? draft : v));
      setValue("badges", next);
    }
    setEditingBadge(null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col min-h-[60vh]">
      <div className="px-6 py-4 border-b border-border shrink-0">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold leading-none">{initialData ? "Edit Mineral" : "Add New Mineral"}</h2>
            <p className="text-sm text-muted-foreground">
              Complete the details below to list a new mineral in the catalog.
            </p>
            {initialData && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  <span className="font-mono">{initialData.id}</span>
                </div>
                {initialData.createdAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(initialData.createdAt), "MMM dd, yyyy")}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 min-h-[400px] overflow-y-auto px-6">
        <div className="space-y-6 py-6">

          {/* Product category – same options as Mineral categories in catalog */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">Product category</CardTitle>
              <CardDescription className="text-xs">Select the catalog category for this mineral (Precious metals, Base metals, Energy minerals, Other, or a custom category).</CardDescription>
            </CardHeader>
            <CardContent>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={field.value || ""} onValueChange={field.onChange}>
                      <SelectTrigger id="category" className="w-full max-w-sm">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
            </CardContent>
          </Card>
          
          {/* 1. Mineral Name */}
          <Section title={SECTION_TITLES.basic} isOpen={openSections.basic} onToggle={() => toggleSection('basic')}>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Mineral Name</Label>
                <Input id="name" {...register("name", { required: true })} placeholder="e.g. Lithium Carbonate" />
                {errors.name && <span className="text-xs text-red-500">Required</span>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subProductDescription">Sub product description</Label>
                <Textarea id="subProductDescription" {...register("subProductDescription")} placeholder="Short sub description or tagline..." rows={3} className="resize-none" />
              </div>
            </div>
          </Section>

          {/* 2. Product description – separate card */}
          <Section title={SECTION_TITLES.productDescription} isOpen={openSections.productDescription} onToggle={() => toggleSection('productDescription')}>
            <div className="grid gap-2">
              <Label htmlFor="description">Product description</Label>
              <Textarea id="description" {...register("description")} placeholder="Describe the product (grade, use case, origin, etc.)..." rows={4} className="resize-none" />
            </div>
          </Section>

          {/* 3. Media */}
          <Section title={SECTION_TITLES.media} isOpen={openSections.media} onToggle={() => toggleSection('media')}>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Primary Image (Hero)</Label>
                <Controller
                  name="heroImage"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value.trim() || null)}
                          placeholder="Paste image URL (https://...)"
                          className="font-mono text-sm flex-1 min-w-[200px]"
                        />
                        <span className="text-xs text-muted-foreground">or</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={heroFileInputRef}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && file.type.startsWith("image/")) {
                              const reader = new FileReader();
                              reader.onload = () => field.onChange(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                            e.target.value = "";
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => heroFileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload file
                        </Button>
                      </div>
                      {field.value && (
                        <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden max-w-xs aspect-video bg-slate-100 dark:bg-slate-800">
                          <img src={field.value} alt="Hero preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        </div>
                      )}
                    </div>
                  )}
                />
                <p className="text-xs text-muted-foreground">Paste an image URL or upload a file (PNG, JPG).</p>
              </div>
              <div className="grid gap-2">
                <Label>Additional Images</Label>
                <Controller
                  name="additionalImages"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <div className="flex gap-2 flex-wrap">
                        {(field.value || []).map((url, i) => (
                          <div key={i} className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden max-w-[140px]">
                            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 shrink-0">
                              <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            </div>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => field.onChange((field.value || []).filter((_, j) => j !== i))} aria-label="Remove">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex gap-2 items-center flex-wrap">
                          <Input
                            placeholder="Paste URL (https://...)"
                            className="w-[180px] font-mono text-xs"
                            value={additionalImageUrlInput}
                            onChange={(e) => setAdditionalImageUrlInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const v = additionalImageUrlInput.trim();
                                if (v) {
                                  field.onChange([...(field.value || []), v]);
                                  setAdditionalImageUrlInput("");
                                }
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const v = additionalImageUrlInput.trim();
                              if (v) {
                                field.onChange([...(field.value || []), v]);
                                setAdditionalImageUrlInput("");
                              }
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add URL
                          </Button>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            ref={additionalFilesInputRef}
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/"));
                              if (!files.length) {
                                e.target.value = "";
                                return;
                              }
                              const existing = field.value || [];
                              const results: string[] = [];
                              let done = 0;
                              files.forEach((file) => {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  results.push(reader.result as string);
                                  done++;
                                  if (done === files.length) {
                                    field.onChange([...existing, ...results]);
                                  }
                                };
                                reader.readAsDataURL(file);
                              });
                              e.target.value = "";
                            }}
                          />
                          <Button type="button" variant="outline" size="sm" onClick={() => additionalFilesInputRef.current?.click()}>
                            <Upload className="h-4 w-4 mr-1" />
                            Upload
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                />
                <p className="text-xs text-muted-foreground">Add image URLs or upload files (optional).</p>
              </div>
            </div>
          </Section>

          {/* 3. Classification */}
          <Section title={SECTION_TITLES.classification} isOpen={openSections.classification} onToggle={() => toggleSection('classification')}>
            <div className="space-y-4">
              {/* Mineral Type — add / edit / delete list */}
              <div className="grid gap-2">
                <Label>Mineral Type</Label>
                <p className="text-xs text-muted-foreground">Add, edit, or delete mineral types for this listing.</p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Select value={addMineralTypeSelect || "__placeholder__"} onValueChange={(v) => { if (v && v !== "__placeholder__") { addMineralTypeOption(v); setAddMineralTypeSelect("__placeholder__"); } }}>
                    <SelectTrigger className="w-[180px] h-8 text-sm">
                      <SelectValue placeholder="Add from list..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__placeholder__" className="text-muted-foreground">Add from list...</SelectItem>
                      {MINERAL_TYPE_OPTIONS.filter((opt) => !mineralTypes.includes(opt)).map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Or add custom type"
                    value={customMineralTypeInput}
                    onChange={(e) => setCustomMineralTypeInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomMineralType())}
                    className="max-w-[160px] h-8 text-sm"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addCustomMineralType} className="h-8">
                    Add custom
                  </Button>
                </div>
                {mineralTypes.length > 0 && (
                  <ul className="border rounded-md divide-y divide-border mt-2">
                    {mineralTypes.map((item: string) => (
                      <li key={item} className="flex items-center gap-2 px-3 py-2 text-sm">
                        {editingMineralType === item ? (
                          <>
                            <Input
                              value={editingMineralTypeDraft}
                              onChange={(e) => setEditingMineralTypeDraft(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), saveEditMineralType())}
                              className="h-8 flex-1"
                            />
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={saveEditMineralType} aria-label="Save">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setEditingMineralType(null)} aria-label="Cancel">
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 font-medium">{item}</span>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => startEditMineralType(item)} aria-label="Edit">
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-destructive hover:text-destructive" onClick={() => removeMineralType(item)} aria-label="Delete">
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="grid gap-2">
                <Label>Mineral Tags</Label>
                <div className="flex gap-2">
                  <Input 
                    value={tagInput} 
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag and press Enter" 
                  />
                  <Button type="button" onClick={addTag} size="sm" variant="secondary">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </div>
              {/* Certification Badges — add / edit / delete list */}
              <div className="grid gap-2">
                <Label>Certification Badges</Label>
                <p className="text-xs text-muted-foreground">Add, edit, or delete badges (e.g. Verified Batch, Artisanal Source, Compliance Cleared).</p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Select value={addBadgeSelect || "__placeholder__"} onValueChange={(v) => { if (v && v !== "__placeholder__") { addBadgeOption(v); setAddBadgeSelect("__placeholder__"); } }}>
                    <SelectTrigger className="w-[180px] h-8 text-sm">
                      <SelectValue placeholder="Add from list..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__placeholder__" className="text-muted-foreground">Add from list...</SelectItem>
                      {BADGE_OPTIONS.filter((b) => !badges.includes(b)).map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Or add custom badge"
                    value={customBadgeInput}
                    onChange={(e) => setCustomBadgeInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomBadge())}
                    className="max-w-[160px] h-8 text-sm"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addCustomBadge} className="h-8">
                    Add custom
                  </Button>
                </div>
                {badges.length > 0 && (
                  <ul className="border rounded-md divide-y divide-border mt-2">
                    {badges.map((item: string) => (
                      <li key={item} className="flex items-center gap-2 px-3 py-2 text-sm">
                        {editingBadge === item ? (
                          <>
                            <Input
                              value={editingBadgeDraft}
                              onChange={(e) => setEditingBadgeDraft(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), saveEditBadge())}
                              className="h-8 flex-1"
                            />
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={saveEditBadge} aria-label="Save">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setEditingBadge(null)} aria-label="Cancel">
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 font-medium">{item}</span>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => startEditBadge(item)} aria-label="Edit">
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-destructive hover:text-destructive" onClick={() => removeBadge(item)} aria-label="Delete">
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Section>

          {/* 4. Origin */}
          <Section title={SECTION_TITLES.origin} isOpen={openSections.origin} onToggle={() => toggleSection('origin')}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Country</Label>
                  <Input {...register("country")} placeholder="e.g. Ghana" />
                </div>
                <div className="grid gap-2">
                  <Label>Source Type</Label>
                  <Controller
                    control={control}
                    name="sourceType"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Artisanal">Artisanal</SelectItem>
                          <SelectItem value="Industrial">Industrial</SelectItem>
                          <SelectItem value="Cooperative">Cooperative</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Region / Mine Location</Label>
                <Input {...register("region")} placeholder="e.g. Tarkwa" />
              </div>
            </div>
          </Section>

          {/* 5. Purity */}
          <Section title={SECTION_TITLES.purity} isOpen={openSections.purity} onToggle={() => toggleSection('purity')}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Purity Percentage (%)</Label>
                  <Input type="number" step="0.01" {...register("purity")} placeholder="99.9" />
                </div>
                <div className="grid gap-2">
                  <Label>Grade / Standard</Label>
                  <Input {...register("grade")} placeholder="Optional" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Certificate ID</Label>
                <Input {...register("purityCertificationId")} placeholder="Auth ID" />
              </div>
            </div>
          </Section>

          {/* 6. Due Diligence */}
          <Section title={SECTION_TITLES.dueDiligence} isOpen={openSections.dueDiligence} onToggle={() => toggleSection('dueDiligence')}>
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground">Blockchain Proof</h4>
                <div className="flex items-center justify-between">
                  <Label htmlFor="blockchain-toggle">Enable Blockchain Record</Label>
                  <Controller
                    control={control}
                    name="blockchainRecordEnabled"
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} id="blockchain-toggle" />
                    )}
                  />
                </div>
                {watch("blockchainRecordEnabled") && (
                  <div className="grid gap-2">
                    <Label>Blockchain Hash / ID</Label>
                    <Input {...register("blockchainHash")} placeholder="0x..." />
                  </div>
                )}
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground">Market Insights</h4>
                <div className="flex items-center justify-between">
                  <Label>Enable AI Insights</Label>
                  <Controller
                    control={control}
                    name="marketInsightsEnabled"
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Demand Indicator</Label>
                  <Controller
                    control={control}
                    name="demandIndicator"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* 7. Allocation */}
          <Section title={SECTION_TITLES.allocation} isOpen={openSections.allocation} onToggle={() => toggleSection('allocation')}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Available Quantity (MT)</Label>
                  <Input type="number" {...register("availableQuantity")} />
                </div>
                <div className="grid gap-2">
                  <Label>Min. Allocation (MT)</Label>
                  <Input type="number" {...register("minAllocation")} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Allocation Lock Duration (Hours)</Label>
                <Input type="number" {...register("allocationLockDuration")} />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label>Instant Allocation</Label>
                  <p className="text-xs text-muted-foreground">Allow immediate locking</p>
                </div>
                <Controller
                  control={control}
                  name="instantAllocation"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
            </div>
          </Section>

          {/* 8. Pricing */}
          <Section title={SECTION_TITLES.pricing} isOpen={openSections.pricing} onToggle={() => toggleSection('pricing')}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Base Price per MT</Label>
                  <Input type="number" {...register("basePrice")} />
                </div>
                <div className="grid gap-2">
                  <Label>Currency</Label>
                  <Input {...register("currency")} defaultValue="USD" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label>Price Visibility</Label>
                <Controller
                  control={control}
                  name="priceVisibility"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
              <Separator className="my-4" />
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">AI estimate (order summary)</h4>
                <p className="text-xs text-muted-foreground mb-3">Used for AI-estimated Subtotal, Transport, Fee, and Total in the app buy flow.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Platform fee %</Label>
                    <Input type="number" min={0} step={0.5} {...register("platformFeePercent", { valueAsNumber: true })} placeholder="1" />
                    <p className="text-xs text-muted-foreground">e.g. 1 = 1%</p>
                  </div>
                  <div className="grid gap-2">
                    <Label>Default transport (fixed amount)</Label>
                    <Input type="number" min={0} {...register("defaultTransportAmount", { valueAsNumber: true })} placeholder="0" />
                    <p className="text-xs text-muted-foreground">Same currency as above</p>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* 9. Compliance */}
          <Section title={SECTION_TITLES.compliance} isOpen={openSections.compliance} onToggle={() => toggleSection('compliance')}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label>KYC Required</Label>
                <Controller
                  control={control}
                  name="kycRequired"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>

              {/* Visible To — add / edit / delete list */}
              <div className="grid gap-2">
                <Label>Visible To</Label>
                <p className="text-xs text-muted-foreground">Select which buyer categories this mineral listing is available to. Add, edit, or delete entries below.</p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Select value={addVisibleToSelect || "__placeholder__"} onValueChange={(v) => { if (v && v !== "__placeholder__") { addVisibleToOption(v); setAddVisibleToSelect("__placeholder__"); } }}>
                    <SelectTrigger className="w-[180px] h-8 text-sm">
                      <SelectValue placeholder="Add from list..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__placeholder__" className="text-muted-foreground">Add from list...</SelectItem>
                      {VISIBLE_TO_OPTIONS.filter((a) => !visibleTo.includes(a)).map((audience) => (
                        <SelectItem key={audience} value={audience}>{audience}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Or add custom (e.g. Government)"
                    value={customVisibleToInput}
                    onChange={(e) => setCustomVisibleToInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomVisibleTo())}
                    className="max-w-[180px] h-8 text-sm"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addCustomVisibleTo} className="h-8">
                    Add custom
                  </Button>
                </div>
                {visibleTo.length > 0 && (
                  <ul className="border rounded-md divide-y divide-border mt-2">
                    {visibleTo.map((item: string) => (
                      <li key={item} className="flex items-center gap-2 px-3 py-2 text-sm">
                        {editingVisibleTo === item ? (
                          <>
                            <Input
                              value={editingVisibleToDraft}
                              onChange={(e) => setEditingVisibleToDraft(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), saveEditVisibleTo())}
                              className="h-8 flex-1"
                            />
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={saveEditVisibleTo} aria-label="Save">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setEditingVisibleTo(null)} aria-label="Cancel">
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 font-medium">{item}</span>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => startEditVisibleTo(item)} aria-label="Edit">
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-destructive hover:text-destructive" onClick={() => removeVisibleTo(item)} aria-label="Delete">
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Institutional buyer category — add / edit / delete list */}
              <div className="grid gap-2">
                <Label>Institutional Buyer Category</Label>
                <p className="text-xs text-muted-foreground">Select which buyer categories this mineral listing is available to. Add, edit, or delete entries below.</p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Select value={addInstitutionalSelect || "__placeholder__"} onValueChange={(v) => { if (v && v !== "__placeholder__") { addInstitutionalOption(v); setAddInstitutionalSelect("__placeholder__"); } }}>
                    <SelectTrigger className="w-[200px] h-8 text-sm">
                      <SelectValue placeholder="Add from list..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__placeholder__" className="text-muted-foreground">Add from list...</SelectItem>
                      {INSTITUTIONAL_BUYER_CATEGORY_OPTIONS.filter((c) => !institutionalBuyerCategories.includes(c)).map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Checkbox
                    id="others-cat"
                    checked={showOthersCategoryInput}
                    onCheckedChange={(checked) => setShowOthersCategoryInput(!!checked)}
                  />
                  <span className="text-sm">Others</span>
                  {showOthersCategoryInput && (
                    <>
                      <Input
                        placeholder="Enter category (e.g. Government)"
                        value={otherCategoryInput}
                        onChange={(e) => setOtherCategoryInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addOtherCategory())}
                        className="max-w-[200px] h-8 text-sm"
                      />
                      <Button type="button" variant="outline" size="sm" onClick={addOtherCategory} className="h-8">
                        Add
                      </Button>
                    </>
                  )}
                </div>
                {institutionalBuyerCategories.length > 0 && (
                  <ul className="border rounded-md divide-y divide-border mt-2">
                    {institutionalBuyerCategories.map((item: string) => (
                      <li key={item} className="flex items-center gap-2 px-3 py-2 text-sm">
                        {editingInstitutional === item ? (
                          <>
                            <Input
                              value={editingInstitutionalDraft}
                              onChange={(e) => setEditingInstitutionalDraft(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), saveEditInstitutional())}
                              className="h-8 flex-1"
                            />
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={saveEditInstitutional} aria-label="Save">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setEditingInstitutional(null)} aria-label="Cancel">
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 font-medium">{item}</span>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => startEditInstitutional(item)} aria-label="Edit">
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-destructive hover:text-destructive" onClick={() => removeInstitutionalCategory(item)} aria-label="Delete">
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Section>

          {/* 10. CTA */}
          <Section title={SECTION_TITLES.cta} isOpen={openSections.cta} onToggle={() => toggleSection('cta')}>
             <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Primary CTA Enabled</Label>
                <Controller
                  control={control}
                  name="ctaEnabled"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Label>CTA Label</Label>
                <Input {...register("ctaLabel")} />
              </div>
             </div>
          </Section>

          {/* 11. Verification Status */}
          <Section title={SECTION_TITLES.status} isOpen={openSections.status} onToggle={() => toggleSection('status')}>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Current Status</Label>
                <Controller
                  control={control}
                  name="verificationStatus"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={`w-full 
                        ${field.value === 'Verified' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' : ''}
                        ${field.value === 'Pending' ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400' : ''}
                        ${field.value === 'Rejected' ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' : ''}
                      `}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Verified" className="text-emerald-600 focus:text-emerald-700">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Verified
                          </div>
                        </SelectItem>
                        <SelectItem value="Pending" className="text-amber-600 focus:text-amber-700">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            Pending Review
                          </div>
                        </SelectItem>
                        <SelectItem value="Rejected" className="text-red-600 focus:text-red-700">
                           <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            Rejected
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Control the public visibility and verification status of this mineral listing.
                </p>
              </div>
            </div>
          </Section>

        </div>
      </div>
      
      <div className="p-6 border-t border-border flex flex-col-reverse sm:flex-row gap-2 sm:justify-end shrink-0">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
          {initialData ? "Save Changes" : "Create Mineral"}
        </Button>
      </div>
    </form>
  );
}

function Section({ title, children, isOpen, onToggle }: { title: string, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) {
  return (
    <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
      <button 
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full p-4 font-medium text-left"
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
          <Separator className="mb-4" />
          {children}
        </div>
      )}
    </div>
  );
}
