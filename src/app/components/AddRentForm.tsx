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
import { useGetSingleTenant } from "../api/queries";
import { useParams } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  reading: z
    .number()
    .nonnegative({ message: "Reading must be 0 or greater" })
    .nullable(),
  notes: z.string().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddRentForm() {
  const params = useParams();
  const id = params["id"] as string;
  const { data: tenantDetails } = useGetSingleTenant(id);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reading: null,
      notes: null,
    },
  });
  const currentRent = tenantDetails?.tenant?.rent;
  const currentWaterBill = tenantDetails?.tenant?.waterBill;

  const [total, setTotal] = useState(
    (currentRent ?? 0) + (currentWaterBill ?? 0)
  );

  const onSubmit = (formData: FormValues) => {};

  return (
    <div className="w-3/4 h-full flex flex-col justify-start gap-2 p-2 items-center">
      <span>Add Rent</span>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="reading"
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
            name="notes"
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
