'use client';

import type { DateRange } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import * as React from 'react';
import { DateRange as ReactDateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/forms';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const forecastFormSchema = z.object({
  productDescription: z
    .string()
    .min(20, { message: 'Product description must be at least 20 characters.' })
    .max(2000, { message: 'Product description must not exceed 2000 characters.' }),
  dateRange: z.custom<DateRange>().optional(),
});

type ForecastFormValues = z.infer<typeof forecastFormSchema>;

interface ForecastFormProps {
  onSubmit: (descriptionWithDate: string) => void;
  isLoading: boolean;
}

export function ForecastForm({ onSubmit, isLoading }: ForecastFormProps) {
  const [date, setDate] = React.useState<ReactDateRange | undefined>({
    from: addDays(new Date(), -365),
    to: new Date(),
  });

  const form = useForm<ForecastFormValues>({
    resolver: zodResolver(forecastFormSchema),
    defaultValues: {
      productDescription: '',
      dateRange: { from: addDays(new Date(), -365), to: new Date() },
    },
  });

  React.useEffect(() => {
    // Update form value when local date state changes
    form.setValue('dateRange', date);
  }, [date, form]);


  function handleFormSubmit(values: ForecastFormValues) {
    let fullDescription = values.productDescription;
    if (values.dateRange?.from && values.dateRange?.to) {
      fullDescription += `\n\nContextual Date Range: ${format(values.dateRange.from, 'PPP')} - ${format(values.dateRange.to, 'PPP')}.`;
    } else if (values.dateRange?.from) {
      fullDescription += `\n\nContextual Start Date: ${format(values.dateRange.from, 'PPP')}.`;
    }
    onSubmit(fullDescription);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="productDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Description & Sales Trends</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Our flagship X1 Widget has shown steady 10% MoM growth. We expect a 20% surge next quarter due to a new marketing campaign..."
                  className="min-h-[120px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide details about the product, its past sales performance, and any factors that might influence future sales.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Contextual Date Range (Optional)</FormLabel>
               <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select a date range that provides context for your description.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Forecast...
            </>
          ) : (
            'Generate Forecast'
          )}
        </Button>
      </form>
    </Form>
  );
}
