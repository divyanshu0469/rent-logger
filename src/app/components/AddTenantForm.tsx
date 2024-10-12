"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGetUser } from "../api/queries";
import { useToast } from "@/hooks/use-toast";
import { useAddTenant } from "../api/mutations";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  rent: z
    .number()
    .positive({ message: "Rent must be greater than 0" })
    .nullable(),
  lastReading: z
    .number()
    .nonnegative({ message: "Reading must be 0 or greater" })
    .nullable(),
  waterBill: z
    .number()
    .positive({ message: "Water bill must be greater than 0" })
    .nullable(),
  lastNotes: z.string().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddTenantForm() {
  const { toast } = useToast();
  const { data: userDetails } = useGetUser();
  const { mutateAsync: addTenant } = useAddTenant();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      rent: null,
      lastReading: null,
      waterBill: null,
      lastNotes: null,
    },
  });

  const onSubmit = async (formData: FormValues) => {
    const email = userDetails?.email;
    if (!email) {
      toast({ description: "Please try again" });
      return;
    }
    const { message } = await addTenant({
      email,
      name: formData.name,
      rent: formData.rent,
      lastReading: formData.lastReading,
      waterBill: formData.waterBill,
      lastNotes: formData.lastNotes,
    });
    toast({ description: message });
  };

  return (
    <div className="w-3/4 h-full flex flex-col justify-start gap-2 p-2 items-center">
      <span>Add Tenant</span>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter name of tenant"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rent</FormLabel>
                <FormControl>
                  <Input
                    min={1}
                    type="number"
                    placeholder="Enter rent amount"
                    {...field}
                    value={field.value !== null ? field.value : ""}
                    onChange={(e) => {
                      const value = e.target.value
                        ? parseFloat(e.target.value)
                        : undefined;
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormDescription>Must be greater than 0</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastReading"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reading</FormLabel>
                <FormControl>
                  <Input
                    min={0}
                    type="number"
                    placeholder="Enter reading"
                    {...field}
                    value={field.value !== null ? field.value : ""}
                    onChange={(e) => {
                      const value = e.target.value
                        ? parseFloat(e.target.value)
                        : undefined;
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormDescription>Must be 0 or greater</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="waterBill"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Water Bill (optional)</FormLabel>
                <FormControl>
                  <Input
                    min={1}
                    type="number"
                    placeholder="Enter water bill amount"
                    {...field}
                    value={field.value !== null ? field.value : ""}
                    onChange={(e) => {
                      const value = e.target.value
                        ? parseFloat(e.target.value)
                        : null;
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  If provided, must be greater than 0
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any additional notes"
                    {...field}
                    value={field.value !== null ? field.value : ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-center">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
