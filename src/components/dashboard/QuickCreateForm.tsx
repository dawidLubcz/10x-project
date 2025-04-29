import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { useQuickCreateFlashcard } from "../../lib/hooks/useQuickCreateFlashcard";
import type { QuickCreateFormData } from "../../lib/types/dashboard";
import type { FieldPath, FieldValues } from "react-hook-form";

// Walidacja formularza
const formSchema = z.object({
  front: z.string()
    .min(1, { message: "Pytanie jest wymagane" })
    .max(200, { message: "Pytanie może zawierać maksymalnie 200 znaków" }),
  back: z.string()
    .min(1, { message: "Odpowiedź jest wymagana" })
    .max(500, { message: "Odpowiedź może zawierać maksymalnie 500 znaków" })
});

const QuickCreateForm: React.FC = () => {
  const { createFlashcard, loading, error, success } = useQuickCreateFlashcard();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const form = useForm<QuickCreateFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      front: "",
      back: ""
    }
  });

  const onSubmit = async (data: QuickCreateFormData) => {
    await createFlashcard(data);
    setFormSubmitted(true);
    
    // Resetuj formularz po udanym utworzeniu
    if (!error) {
      setTimeout(() => {
        form.reset();
        setFormSubmitted(false);
      }, 2000);
    }
  };

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="text-xl">Szybka fiszka</CardTitle>
      </CardHeader>
      <CardContent>
        {error && formSubmitted && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Błąd</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {success && formSubmitted && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Sukces</AlertTitle>
            <AlertDescription>Fiszka została utworzona pomyślnie</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="front"
              render={({ field }: { field: Record<string, any> }) => (
                <FormItem>
                  <FormLabel>Pytanie (front)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Np. Co to jest astrofizyka?"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="back"
              render={({ field }: { field: Record<string, any> }) => (
                <FormItem>
                  <FormLabel>Odpowiedź (back)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Np. Astrofizyka to dział astronomii i fizyki badający właściwości fizyczne ciał niebieskich oraz zjawiska zachodzące we wszechświecie."
                      {...field}
                      className="min-h-[100px]"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="px-0 pb-0">
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Tworzenie...
                  </>
                ) : (
                  "Utwórz fiszkę"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default QuickCreateForm; 