"use client";

import { useState } from "react";
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
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  rent: z.number().positive({ message: "Rent must be greater than 0" }),
  reading: z.number().nonnegative({ message: "Reading must be 0 or greater" }),
  waterBill: z
    .number()
    .positive({ message: "Water bill must be greater than 0" })
    .nullable(),
  notes: z.string().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddRentForm() {
  const router = useRouter();
  const { data } = useGetUser();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      rent: undefined,
      reading: undefined,
      waterBill: null,
      notes: null,
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // Here you would typically send this data to your backend
    alert("Form submitted successfully!");
  };

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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter name"
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
