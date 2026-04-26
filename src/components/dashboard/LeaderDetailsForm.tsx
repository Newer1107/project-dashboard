"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { updateLeaderProjectDetails } from "@/server/actions/projects";
import { Settings2 } from "lucide-react";

// 1. Define the Zod Schema for the frontend
const formSchema = z.object({
  projectId: z.string(),
  type: z.enum(["INHOUSE", "OUTHOUSE", "INDUSTRY_SPONSORED"]),
  category: z.enum(["APPLICATION", "MULTIDISCIPLINARY", "RESEARCH", "CORE"]),
  application: z.enum([
    "SOCIETY_USE",
    "GOVERNMENT_USE",
    "INSTITUTE_USE",
    "INDUSTRY_USE",
  ]),
  outcome: z.enum(["PUBLICATION", "PATENT", "PRODUCT", "COPYRIGHT"]),
  poMapping: z.string().min(1, "PO Mapping is required"),
  psoMapping: z.string().min(1, "PSO Mapping is required"),
  sdg: z.enum([
    "GOAL_1_NO_POVERTY",
    "GOAL_2_ZERO_HUNGER",
    "GOAL_3_GOOD_HEALTH",
    "GOAL_4_QUALITY_EDUCATION",
    "GOAL_5_GENDER_EQUALITY",
    "GOAL_6_CLEAN_WATER",
    "GOAL_7_CLEAN_ENERGY",
    "GOAL_8_DECENT_WORK",
    "GOAL_9_INDUSTRY_INNOVATION",
    "GOAL_10_REDUCED_INEQUALITIES",
    "GOAL_11_SUSTAINABLE_CITIES",
    "GOAL_12_RESPONSIBLE_CONSUMPTION",
    "GOAL_13_CLIMATE_ACTION",
    "GOAL_14_LIFE_BELOW_WATER",
    "GOAL_15_LIFE_ON_LAND",
    "GOAL_16_PEACE_AND_JUSTICE",
    "GOAL_17_PARTNERSHIPS",
  ]),
});

// TypeScript type inferred from the Zod schema
type FormValues = z.infer<typeof formSchema>;

const SDGs = [
  { value: "GOAL_1_NO_POVERTY", label: "1. No Poverty" },
  { value: "GOAL_2_ZERO_HUNGER", label: "2. Zero Hunger" },
  { value: "GOAL_3_GOOD_HEALTH", label: "3. Good Health & Well-being" },
  { value: "GOAL_4_QUALITY_EDUCATION", label: "4. Quality Education" },
  { value: "GOAL_5_GENDER_EQUALITY", label: "5. Gender Equality" },
  { value: "GOAL_6_CLEAN_WATER", label: "6. Clean Water & Sanitation" },
  { value: "GOAL_7_CLEAN_ENERGY", label: "7. Affordable & Clean Energy" },
  { value: "GOAL_8_DECENT_WORK", label: "8. Decent Work & Economic Growth" },
  {
    value: "GOAL_9_INDUSTRY_INNOVATION",
    label: "9. Industry, Innovation & Infrastructure",
  },
  { value: "GOAL_10_REDUCED_INEQUALITIES", label: "10. Reduced Inequalities" },
  {
    value: "GOAL_11_SUSTAINABLE_CITIES",
    label: "11. Sustainable Cities & Communities",
  },
  {
    value: "GOAL_12_RESPONSIBLE_CONSUMPTION",
    label: "12. Responsible Consumption & Production",
  },
  { value: "GOAL_13_CLIMATE_ACTION", label: "13. Climate Action" },
  { value: "GOAL_14_LIFE_BELOW_WATER", label: "14. Life Below Water" },
  { value: "GOAL_15_LIFE_ON_LAND", label: "15. Life on Land" },
  {
    value: "GOAL_16_PEACE_AND_JUSTICE",
    label: "16. Peace, Justice & Strong Institutions",
  },
  { value: "GOAL_17_PARTNERSHIPS", label: "17. Partnerships for the Goals" },
];

export function LeaderDetailsForm({ project }: { project: any }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 2. Wire up the Zod resolver to useForm
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectId: project.id,
      type: (project.type as any) || undefined,
      category: (project.category as any) || undefined,
      application: (project.application as any) || undefined,
      outcome: (project.outcome as any) || undefined,
      poMapping: project.poMapping || "",
      psoMapping: project.psoMapping || "",
      sdg: (project.sdg as any) || undefined,
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      await updateLeaderProjectDetails(data);
      toast.success("Project details updated successfully");
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update project details");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          Set Final Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Project Metadata</DialogTitle>
          <DialogDescription>
            As Group Leader, please define the core classifications for{" "}
            {project.title}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="INHOUSE">In-House</SelectItem>
                        <SelectItem value="OUTHOUSE">Outhouse</SelectItem>
                        <SelectItem value="INDUSTRY_SPONSORED">
                          Industry Sponsored
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="APPLICATION">Application</SelectItem>
                        <SelectItem value="MULTIDISCIPLINARY">
                          Multidisciplinary
                        </SelectItem>
                        <SelectItem value="RESEARCH">Research</SelectItem>
                        <SelectItem value="CORE">Core</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="application"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Focus</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select focus" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SOCIETY_USE">Society Use</SelectItem>
                        <SelectItem value="GOVERNMENT_USE">
                          Government Use
                        </SelectItem>
                        <SelectItem value="INSTITUTE_USE">
                          Institute Use
                        </SelectItem>
                        <SelectItem value="INDUSTRY_USE">
                          Industry Use
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="outcome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Outcome</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select outcome" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PUBLICATION">Publication</SelectItem>
                        <SelectItem value="PATENT">Patent</SelectItem>
                        <SelectItem value="PRODUCT">Product</SelectItem>
                        <SelectItem value="COPYRIGHT">Copyright</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="poMapping"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PO Mapping</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. PO1, PO2, PO3" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="psoMapping"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PSO Mapping</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 1, 2" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="sdg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sustainable Development Goal (SDG)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an SDG" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SDGs.map((sdg) => (
                        <SelectItem key={sdg.value} value={sdg.value}>
                          {sdg.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Details"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
