"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGetSingleTenant } from "../api/queries";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAddRent } from "../api/mutations";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  reading: z
    .number({
      required_error: "Reading is required",
      invalid_type_error: "Reading must be a number",
    })
    .nonnegative(),
  readingDifference: z.number().nonnegative().nullable(),
  notes: z.string().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddRentForm() {
  const { toast } = useToast();
  const params = useParams();
  const id = params["id"] as string;
  const { mutateAsync: addRent } = useAddRent();
  const { data: tenantDetails } = useGetSingleTenant(id);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reading: 0,
      readingDifference: null,
      notes: null,
    },
  });

  const currentRent = tenantDetails?.tenant?.rent || 0;
  const currentWaterBill = tenantDetails?.tenant?.waterBill || 0;
  const lastReading = tenantDetails?.tenant?.lastReading || 0;
  const lastNotes = tenantDetails?.tenant?.lastNotes;

  const calculateReadingDifference = useCallback(
    (reading: number | null): number => {
      return lastReading ? (reading ?? 0) - lastReading : 0;
    },
    [lastReading]
  );

  const calculateTotalBill = useCallback(
    (readingDifference: number): number => {
      return currentRent + currentWaterBill + readingDifference * 8;
    },
    [currentRent, currentWaterBill]
  );

  const [readingDifference, setReadingDifference] = useState<number>(
    calculateReadingDifference(form.getValues("reading"))
  );

  const [totalBill, setTotalBill] = useState<number>(
    calculateTotalBill(readingDifference)
  );

  useEffect(() => {
    const newReading = form.getValues("reading");
    const newReadingDifference = calculateReadingDifference(newReading);
    setReadingDifference(newReadingDifference);
    setTotalBill(calculateTotalBill(newReadingDifference));
  }, [
    form,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    form.getValues("reading"),
    calculateReadingDifference,
    calculateTotalBill,
  ]);

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    const response = await addRent({
      tenantId: id,
      notes: formData.notes,
      totalBill,
      reading: formData.reading ?? 0,
      readingDifference: readingDifference,
    });
    toast({ description: response.message });
  };

  return (
    <div className="w-3/4 h-full flex flex-col justify-start gap-2 p-2 items-center">
      <span className="text-xl font-bold">
        Add Rent {`For ${tenantDetails?.tenant?.name}`}
      </span>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <div className="w-full flex flex-col justify-center items-center gap-1">
            <div className="w-full flex flex-row justify-between text-sm">
              <span>Rent:</span>
              <span>{currentRent}</span>
            </div>
            {currentWaterBill ? (
              <div className="w-full flex flex-row justify-between text-sm">
                <span>Water Bill:</span>
                <span>{currentWaterBill}</span>
              </div>
            ) : null}
            {lastReading ? (
              <div className="w-full flex flex-row justify-between text-sm">
                <span>Last Reading :</span>
                <span>{lastReading}</span>
              </div>
            ) : null}
          </div>
          <FormField
            control={form.control}
            name="reading"
            render={({ field }) => (
              <FormItem className="flex flex-row justify-between items-center">
                <FormLabel>Reading: </FormLabel>
                <FormControl>
                  <Input
                    className="w-1/2"
                    type="number"
                    min={0}
                    placeholder="Enter reading"
                    {...field}
                    value={field.value !== null ? field.value : ""}
                    onChange={(e) => {
                      const value = e.target.value
                        ? parseFloat(e.target.value)
                        : undefined;
                      field.onChange(value);
                      const newReadingDifference = calculateReadingDifference(
                        value ?? null
                      );
                      setReadingDifference(newReadingDifference);
                      setTotalBill(calculateTotalBill(newReadingDifference));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="readingDifference"
            render={({ field }) => (
              <FormItem className="flex flex-row justify-between items-center">
                <FormLabel>Reading Difference: </FormLabel>
                <FormControl>
                  <Input
                    className="w-1/2"
                    type="number"
                    placeholder="Enter Difference"
                    {...field}
                    readOnly={Boolean(lastReading)}
                    value={
                      readingDifference > 0 ? readingDifference : undefined
                    }
                    onChange={
                      lastReading
                        ? undefined
                        : (e) => {
                            const value = e.target.value
                              ? parseFloat(e.target.value)
                              : undefined;
                            field.onChange(value);
                            setReadingDifference(value ?? 0);
                            setTotalBill(calculateTotalBill(value ?? 0));
                          }
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row justify-between text-lg font-bold">
            <span>Total:</span>
            <span>{totalBill}</span>
          </div>
          <div>
            <span>Previous Notes:</span>
            <span>
              <Textarea
                readOnly
                value={lastNotes ?? ""}
                placeholder="No Notes"
              />
            </span>
          </div>
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
