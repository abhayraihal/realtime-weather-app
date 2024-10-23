import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { toast } from 'sonner';

// Form schema using Zod
const AlertSchema = z.object({
  maxTemp: z.boolean().default(false),
  minTemp: z.boolean().default(false),
  rain: z.boolean().default(false),
  snow: z.boolean().default(false),
  storm: z.boolean().default(false),
  email: z.string().email('Invalid email address').nonempty('Email is required'),
});

const WeatherAlertForm = ({ defaultValues, onSave }) => {
  // Initialize form using react-hook-form and zod
  const form = useForm({
    resolver: zodResolver(AlertSchema),
    defaultValues: {
      ...defaultValues, // Spread the default values passed via props
      email: '',        // Ensure email field is present
    },
  });

  const onSubmit = (data) => {
    onSave(data); // Trigger the onSave function from parent component with form data
    toast.success("Alert settings saved successfully!");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Input */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2">
              <FormLabel className="text-base">Email</FormLabel>
              <FormControl>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-2 border rounded-md"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Weather Alert Switches */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="maxTemp"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between border p-4">
                <div>
                  <FormLabel className="text-base">
                    Max Temperature (Above 35°C)
                  </FormLabel>
                  <FormDescription>
                    Receive an alert when the temperature goes above 35°C.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minTemp"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between border p-4">
                <div>
                  <FormLabel className="text-base">
                    Min Temperature (Below 5°C)
                  </FormLabel>
                  <FormDescription>
                    Receive an alert when the temperature drops below 5°C.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rain"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between border p-4">
                <div>
                  <FormLabel className="text-base">Rain</FormLabel>
                  <FormDescription>
                    Receive an alert when it's raining.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="snow"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between border p-4">
                <div>
                  <FormLabel className="text-base">Snow</FormLabel>
                  <FormDescription>
                    Receive an alert when it's snowing.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="storm"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between border p-4">
                <div>
                  <FormLabel className="text-base">Storm</FormLabel>
                  <FormDescription>
                    Receive an alert during storms.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button type="submit">Save Alert Settings</Button>
      </form>
    </Form>
  );
};

export default WeatherAlertForm;
